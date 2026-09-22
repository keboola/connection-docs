#!/usr/bin/env python3
"""
gap-analysis.py — embed docs chunks + support tickets, cluster them, and
report where tickets land far from any documentation.

Inputs (produced by the sibling scripts):
  _graph/chunks.jsonl    node scripts/chunk-docs.mjs
  _graph/tickets.jsonl   node scripts/merge-tickets.mjs

Outputs (all under _graph/):
  ticket-coverage.csv   one row per ticket: best-matching chunk, cosine score,
                        cluster id — sort by best_sim ascending for gap candidates
  clusters.csv          one row per cluster: docs vs ticket counts, ticket share,
                        top terms, example titles — ticket-heavy clusters are gaps
  map.html / map.csv    2-D UMAP map of chunks + tickets (plotly if installed)
  page-clusters.json    page slug -> dominant cluster (for the Obsidian vault)

Backends:
  --backend st       sentence-transformers (default when importable). Model via
                     --model, default nomic-ai/nomic-embed-text-v1.5, which wants
                     the search_document: / search_query: prefixes — added
                     automatically for nomic and e5 models.
  --backend tfidf    TF-IDF + truncated SVD. No model download, runs anywhere;
                     weaker semantics, fine for a first pass and for testing.

Usage:
  python scripts/gap-analysis.py [--backend st|tfidf] [--model NAME]
      [--min-cluster-size 8] [--gap-threshold 0.45] [--write-vault]

  --write-vault   also stamp `cluster: N` into _graph/vault/<slug>.md frontmatter
                  so the Obsidian graph can be coloured by semantic cluster.

Install (local machine):
  pip install numpy scikit-learn umap-learn hdbscan plotly pandas sentence-transformers
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
GRAPH = ROOT / "_graph"


def read_jsonl(path: Path) -> list[dict]:
    with path.open(encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]


# ---------------------------------------------------------------------------
# embedding backends
# ---------------------------------------------------------------------------

def embed_st(docs: list[str], queries: list[str], model_name: str) -> tuple[np.ndarray, np.ndarray]:
    from sentence_transformers import SentenceTransformer

    kwargs = {"trust_remote_code": True} if "nomic" in model_name else {}
    model = SentenceTransformer(model_name, **kwargs)
    if "nomic" in model_name:
        dp, qp = "search_document: ", "search_query: "
    elif "e5" in model_name:
        dp, qp = "passage: ", "query: "
    else:
        dp = qp = ""
    d = model.encode([dp + t for t in docs], batch_size=32, normalize_embeddings=True, show_progress_bar=True)
    q = model.encode([qp + t for t in queries], batch_size=32, normalize_embeddings=True, show_progress_bar=True)
    return np.asarray(d), np.asarray(q)


def embed_tfidf(docs: list[str], queries: list[str], dims: int = 256) -> tuple[np.ndarray, np.ndarray]:
    from sklearn.decomposition import TruncatedSVD
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.preprocessing import normalize

    vec = TfidfVectorizer(
        max_features=60000, ngram_range=(1, 2), sublinear_tf=True, min_df=2, stop_words="english",
        token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z0-9_.-]{1,}\b",
    )
    x_docs = vec.fit_transform(docs)
    x_q = vec.transform(queries)
    svd = TruncatedSVD(n_components=min(dims, x_docs.shape[1] - 1), random_state=0)
    d = normalize(svd.fit_transform(x_docs))
    q = normalize(svd.transform(x_q))
    return d, q


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------

def top_terms(texts: list[str], labels: np.ndarray, n: int = 6) -> dict[int, list[str]]:
    """c-TF-IDF style: one bag of words per cluster, tf-idf across clusters."""
    from sklearn.feature_extraction.text import TfidfVectorizer

    groups: dict[int, list[str]] = defaultdict(list)
    for t, l in zip(texts, labels):
        groups[int(l)].append(t)
    ids = sorted(groups)
    vec = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), min_df=1, max_features=50000,
                          token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z0-9_.-]{2,}\b")
    m = vec.fit_transform([" ".join(groups[i]) for i in ids])
    vocab = np.array(vec.get_feature_names_out())
    out = {}
    for row, cid in zip(m, ids):
        arr = row.toarray().ravel()
        out[cid] = [str(v) for v in vocab[np.argsort(-arr)[:n]] if arr[np.argsort(-arr)[:n]].max() > 0]
    return out


def strip_md(t: str) -> str:
    t = re.sub(r"```[\s\S]*?```", " ", t)
    t = re.sub(r"`[^`]*`", " ", t)
    t = re.sub(r"!?\[([^\]]*)\]\([^)]*\)", r"\1", t)
    t = re.sub(r"<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--backend", choices=["st", "tfidf"], default=None)
    ap.add_argument("--model", default="nomic-ai/nomic-embed-text-v1.5")
    ap.add_argument("--min-cluster-size", type=int, default=8)
    ap.add_argument("--gap-threshold", type=float, default=0.45,
                    help="tickets whose best cosine to any chunk is below this are flagged as gaps")
    ap.add_argument("--write-vault", action="store_true")
    ap.add_argument("--chunks", default=str(GRAPH / "chunks.jsonl"))
    ap.add_argument("--tickets", default=str(GRAPH / "tickets.jsonl"))
    args = ap.parse_args()

    chunks = read_jsonl(Path(args.chunks))
    tickets = read_jsonl(Path(args.tickets))
    if not chunks or not tickets:
        print("need both chunks.jsonl and tickets.jsonl — run chunk-docs.mjs and merge-tickets.mjs first", file=sys.stderr)
        return 1

    doc_texts = [strip_md(c["embed_text"]) for c in chunks]
    tk_texts = [strip_md(t["embed_text"]) for t in tickets]

    backend = args.backend
    if backend is None:
        try:
            import sentence_transformers  # noqa: F401
            backend = "st"
        except ImportError:
            backend = "tfidf"
            print("sentence-transformers not installed → falling back to tfidf backend (weaker semantics)", file=sys.stderr)

    print(f"backend={backend} chunks={len(chunks)} tickets={len(tickets)}")
    if backend == "st":
        d_emb, q_emb = embed_st(doc_texts, tk_texts, args.model)
    else:
        d_emb, q_emb = embed_tfidf(doc_texts, tk_texts)

    # ---- coverage: nearest chunk per ticket ---------------------------------
    sims = q_emb @ d_emb.T  # both normalised → cosine
    best = sims.argmax(axis=1)
    best_sim = sims.max(axis=1)
    top3 = np.argsort(-sims, axis=1)[:, :3]

    # ---- clustering on the joint space -------------------------------------
    all_emb = np.vstack([d_emb, q_emb])
    is_ticket = np.array([False] * len(chunks) + [True] * len(tickets))
    try:
        import hdbscan
        import umap

        reducer = umap.UMAP(n_neighbors=15, n_components=5, metric="cosine", random_state=0)
        low = reducer.fit_transform(all_emb)
        labels = hdbscan.HDBSCAN(min_cluster_size=args.min_cluster_size, metric="euclidean").fit_predict(low)
        xy = umap.UMAP(n_neighbors=15, n_components=2, metric="cosine", random_state=0).fit_transform(all_emb)
    except ImportError:
        from sklearn.cluster import KMeans
        from sklearn.decomposition import PCA

        k = max(8, min(60, len(all_emb) // 40))
        labels = KMeans(n_clusters=k, n_init=5, random_state=0).fit_predict(all_emb)
        xy = PCA(n_components=2, random_state=0).fit_transform(all_emb)
        print("umap/hdbscan not installed → KMeans + PCA fallback", file=sys.stderr)

    all_texts = doc_texts + tk_texts
    terms = top_terms(all_texts, labels)

    # ---- outputs -------------------------------------------------------------
    GRAPH.mkdir(exist_ok=True)
    with (GRAPH / "ticket-coverage.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["id", "title", "team", "created_at", "best_sim", "is_gap", "cluster",
                    "best_chunk", "best_url", "alt_chunk_2", "alt_chunk_3", "ticket_url"])
        for i, t in enumerate(tickets):
            w.writerow([
                t["id"], t["title"], t.get("team") or "", (t.get("created_at") or "")[:10],
                f"{best_sim[i]:.3f}", int(best_sim[i] < args.gap_threshold), int(labels[len(chunks) + i]),
                chunks[best[i]]["id"], chunks[best[i]]["url"] + ("#" + chunks[best[i]]["anchor"] if chunks[best[i]].get("anchor") else ""),
                chunks[top3[i][1]]["id"], chunks[top3[i][2]]["id"], t.get("url") or "",
            ])

    rows = []
    for cid in sorted(set(int(l) for l in labels)):
        mask = labels == cid
        n_docs = int((mask & ~is_ticket).sum())
        n_tk = int((mask & is_ticket).sum())
        tk_idx = [i for i in range(len(tickets)) if labels[len(chunks) + i] == cid]
        doc_idx = [i for i in range(len(chunks)) if labels[i] == cid]
        sections = Counter(chunks[i]["section"] for i in doc_idx).most_common(3)
        rows.append({
            "cluster": cid,
            "label": "noise" if cid == -1 else " / ".join(terms.get(cid, [])[:3]),
            "n_docs": n_docs, "n_tickets": n_tk,
            "ticket_share": round(n_tk / max(1, n_docs + n_tk), 3),
            "mean_ticket_sim": round(float(best_sim[tk_idx].mean()), 3) if tk_idx else "",
            "top_terms": ", ".join(terms.get(cid, [])),
            "doc_sections": ", ".join(f"{s}:{n}" for s, n in sections),
            "example_tickets": " | ".join(tickets[i]["title"][:70] for i in tk_idx[:4]),
            "example_pages": " | ".join(sorted({chunks[i]["slug"] for i in doc_idx})[:4]),
        })
    rows.sort(key=lambda r: (-r["ticket_share"], -r["n_tickets"]))
    with (GRAPH / "clusters.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    # map
    with (GRAPH / "map.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["x", "y", "kind", "cluster", "label", "section", "url"])
        for i, c in enumerate(chunks):
            w.writerow([f"{xy[i][0]:.4f}", f"{xy[i][1]:.4f}", "doc", int(labels[i]), c["heading_path"][:80], c["section"], c["url"]])
        for i, t in enumerate(tickets):
            j = len(chunks) + i
            w.writerow([f"{xy[j][0]:.4f}", f"{xy[j][1]:.4f}", "ticket", int(labels[j]), t["title"][:80], t.get("team") or "", t.get("url") or ""])
    try:
        import pandas as pd
        import plotly.express as px

        df = pd.read_csv(GRAPH / "map.csv")
        df["cluster"] = df["cluster"].astype(str)
        fig = px.scatter(df, x="x", y="y", color="cluster", symbol="kind", hover_data=["label", "section", "url"],
                         title=f"Docs chunks vs support tickets ({backend})", opacity=0.75, height=800)
        fig.update_traces(marker={"size": 5})
        fig.write_html(GRAPH / "map.html", include_plotlyjs="cdn")
    except ImportError:
        pass

    # page → dominant cluster (for the vault)
    page_votes: dict[str, Counter] = defaultdict(Counter)
    for i, c in enumerate(chunks):
        if labels[i] != -1:
            page_votes[c["slug"]][int(labels[i])] += 1
    page_clusters = {slug: v.most_common(1)[0][0] for slug, v in page_votes.items()}
    (GRAPH / "page-clusters.json").write_text(json.dumps(page_clusters, indent=1))
    if args.write_vault:
        vault = GRAPH / "vault"
        n = 0
        for slug, cid in page_clusters.items():
            p = vault / (("home" if slug == "" else slug) + ".md")
            if not p.exists():
                continue
            txt = p.read_text(encoding="utf-8")
            txt = re.sub(r"^cluster: .*\n", "", txt, count=1, flags=re.M)
            txt = txt.replace("\ntags:\n", f"\ncluster: {cid}\ntags:\n", 1)
            txt = txt.replace("\ntags:\n", f"\ntags:\n  - cluster/{cid}\n", 1)
            p.write_text(txt, encoding="utf-8")
            n += 1
        print(f"vault: cluster stamped into {n} notes")

    gaps = int((best_sim < args.gap_threshold).sum())
    print(f"tickets flagged as gaps (best_sim < {args.gap_threshold}): {gaps} / {len(tickets)}")
    print(f"clusters: {len(rows)} (noise = {int((labels == -1).sum())} points)")
    print("ticket-heaviest clusters:")
    for r in rows[:8]:
        print(f"  #{r['cluster']:>3} share={r['ticket_share']:.2f} tickets={r['n_tickets']:>3} docs={r['n_docs']:>3}  {r['top_terms'][:70]}")
    print(f"outputs: {GRAPH / 'ticket-coverage.csv'}, {GRAPH / 'clusters.csv'}, {GRAPH / 'map.html'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
