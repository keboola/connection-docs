---
title: Shoptet data template
permalink: /components/scaffolds/e-commerce-shoptet/
---

{: .alert.alert-warning}
Note: This page is temporarly available only in  Czech language as far as Shoptet data template is mainly focused on CZ and SK markets. English version will follow soon. 

* TOC
{:toc}

Stáhnete si data ze svého Shoptetu a z účtů Sklik, Google Ads a Facebook Ads. V Keboola Connection na nich provedete transformace a následně si je budete moci prohlédnout v aplikaci Power BI.

### Založte potřebné účty

1. Založte si zdarma účet v Keboola Connection. [https://connection.north-europe.azure.keboola.com/wizard?target=scaffold:ShoptetEcommerce](https://connection.north-europe.azure.keboola.com/wizard?target=scaffold:ShoptetEcommerce)

1. Založte si zdarma účet v Power BI. [https://app.powerbi.com/signupredirect?pbi_source=web](https://app.powerbi.com/signupredirect?pbi_source=web)

1. Stáhněte si Power BI template pro svoji platformu ([Windows - .pbit](https://drive.google.com/file/d/1eMcqOUD6ehBSEhq3vHeDP1c-DHTEcD18/view?usp=sharing) / [Mac - .pbix](https://drive.google.com/file/d/13pfss7foIlnsgnVX3bkw-NCyB3blXwrB/view?usp=sharing)).

### Získání dat ze Shoptetu

Pro nastavení Shoptetu v Keboola Connection budete potřebovat odkazy na svá data v Shoptetu. Ty si připravíte v administračním rozhraní:
  
#### Export skladu

V Exportu skladu najdete URL, které od vás bude chtít Keboola Connection Shoptet extraktor. Bude vypadat přibližně takto: `https://www.obchod.cz/export/stockStatistics.csv?hash=ec68bf384acee0ec68bf384acee0ec68bf384acee0ec68bf384acee0f384acee0`
  
{: .image-popup}
![Screenshot - Ukázka získání odkazu](/components/data-templates/e-commerce-shoptet/shoptet-1.png)

#### Export zákazníků

V Exportu zákazníků vyberte typ exportu CSV a nastavte IP adresu Keboola Connection - `40.127.144.42` ([více o IP adresách Keboola Connection](/components/ip-addresses/)). URL bude vypadat přibližně následovně: `https://www.obchod.cz/export/customers.csv?ip=40.127.144.42&hash=ec68bf384acee0ec68bf384acee0ec68bf384acee0ec68bf384acee0f384acee0`

{: .image-popup}
![Screenshot - Ukázka získání odkazu](/components/data-templates/e-commerce-shoptet/shoptet-2.png)

#### Export objednávek

Export objednávek je potřeba nastavit podrobněji. Vytvořte si vlastní typ exportu. Vyberte vlastní typ exportu.

{: .image-popup}  
![Screenshot - vlastní typ objednávek](/components/data-templates/e-commerce-shoptet/shoptet-3.png)    
  
Vyberte Shoptet (systémový, formát CSV) a klikněte na **Uložit**.

{: .image-popup}
![Screenshot - šablona exportu](/components/data-templates/e-commerce-shoptet/shoptet-4.png)

Na konci stránky přidejte další položky tlačítkem **Přidat**.

{: .image-popup}
![Screenshot - položky exportu](/components/data-templates/e-commerce-shoptet/shoptet-5.png)

Data o objednávkách – přidejte pole ‘id’ a ‘referrer’ a klikněte na **Uložit**.

{: .image-popup}
![Screenshot - přidání pole](/components/data-templates/e-commerce-shoptet/shoptet-6.png)

Data o zákaznících – vyberte všechna tři pole (Typ zákazníka, Zákaznická skupina, Typ skupiny) a klikněte na **Uložit**.

{: .image-popup}
![Screenshot - přidání pole](/components/data-templates/e-commerce-shoptet/shoptet-7.png)

Data o položkách objednávek – vyberte typ, slevu, nákupní cenu za jednotku a celkovou nákupní cenu. Klikněte na **Uložit**.

{: .image-popup}
![Screenshot - přidání pole](/components/data-templates/e-commerce-shoptet/shoptet-8.png)

Vytvořený vlastní export si nahoře na stránce pojmenujte (např. Keboola – shoptet) a pak jej uložte.

{: .image-popup}
![Screenshot - vytvoření vlastního exportu](/components/data-templates/e-commerce-shoptet/shoptet-9.png)

Po návratu do Exportu objednávek na svůj export (Keboola – Extended) nastavte IP adresu pro Keboola Connection - `40.127.144.42` ([více o IP adresách Keboola Connection](/components/ip-addresses/)).  Poté vyberte a zkopírujte jeho URL. Adresa bude vypadat přibližně takto: `https://www.obchod.cz/export/orders.csv?patternId=90&ip=40.127.144.42&hash=ec68bf384acee0ec68bf384acee0ec68bf384acee0ec68bf384acee0f384ac`

{: .image-popup}
![Screenshot - získání odkazu exportu](/components/data-templates/e-commerce-shoptet/shoptet-10.png)

#### Export produktů

Export produktů je také nutné přizpůsobit. Vytvořte vlastní typ exportu a v něm vyberte všechny položky. Nejjednodušší je u každé sekce kliknout na **Označit vše**. Výsledné nastavení uložte např. pod názvem Keboola produkty.

Po návratu do exportu produktů vyberte svůj export (zase bude poslední), formát CSV, nastavte IP adresu pro Keboola Connection - `40.127.144.42` ([více o IP adresách Keboola Connection](/components/ip-addresses/)) a dole zkopírujte URL adresu exportu. Bude vypadat přibližně takto: `https://www.obchod.cz/export/products.csv?patternId=111&ip=40.127.144.42&hash=ec68bf384acee0ec68bf384acee0ec68bf384acee0ec68bf384acee0f384ac`

{: .image-popup}
![Screenshot - získání odkazu exportu](/components/data-templates/e-commerce-shoptet/shoptet-11.png)

### Nastavení Keboola Connection Shoptet data template

Po přihlášení do Keboola Connection vyberte Components > Data templates a klikněte na **USE THIS** u template **Shoptet Ecommerce**. Od tohoto kroku vás nastavením bude provázet průvodce s nápovědou.

{: .image-popup}
![Screenshot - výběr scaffoldu](/components/data-templates/e-commerce-shoptet/shoptet-12.png)

V něm nastavte Google Ads, Sklik a Shoptet.

{: .image-popup}
![Screenshot - obsah scaffoldu](/components/data-templates/e-commerce-shoptet/shoptet-13.png)

#### Google Ads

V Google Ads vyplňte Google Ads customer ID a uložte. Customer ID naleznete v pravém horním rohu. V našem případě by to bylo `260-790-7112`.

{: .image-popup}
![Screenshot - google Ads id](/components/data-templates/e-commerce-shoptet/shoptet-14.png)

Customer ID následně vyplňte do pole `Google Ads customer ID` v Keboole.

{: .image-popup}
![Screenshot - Google ads ID - Keboola](/components/data-templates/e-commerce-shoptet/shoptet-15.png)

#### Sklik

Nalogujte se do svého Sklik účtu svým administračním emailem. Poté pokračujte v pravém horním rohu do nastavení.

{: .image-popup}
![Screenshot - sklik admin](/components/data-templates/e-commerce-shoptet/shoptet-16.png)

Po prokliku najdete API token (API klíč) v levém dolním rohu. Tento klíč zkopírujte. Pokud klíč nevidíte, nenacházíte se v administračním profilu svého účtu v Sklik.

{: .image-popup}
![Screenshot - sklik Api klíč](/components/data-templates/e-commerce-shoptet/shoptet-17.png)

API klíč následně vyplňte do pole `Sklik API token` v Keboole.

{: .image-popup}
![Screenshot - Sklik API token - Keboola](/components/data-templates/e-commerce-shoptet/shoptet-18.png)

#### Shoptet

V Shoptetu je toho potřeba nastavit o něco víc.

{: .image-popup}
![Screenshot - obsah scaffoldu - shoptet](/components/data-templates/e-commerce-shoptet/shoptet-19.png)

1. Nejdříve zadejte název svého e-shopu (Shop Name). Bude se zobrazovat na reportech.

1. Potom vložte URL adresu svého e-shopu (Base URL), například https://www.obchod.cz.

1. Ostatní URL jsou ta, která jste si zkopírovali z administračního rozhraní Shoptetu.

1. Po vyplnění všech parametrů můžete template (scaffold) použít.

{: .image-popup}
![Screenshot - použít scaffold](/components/data-templates/e-commerce-shoptet/shoptet-20.png)

Konfigurace chvilku potrvá.

{: .image-popup}
![Screenshot - vytvýření scaffoldu](/components/data-templates/e-commerce-shoptet/shoptet-21.png)

#### Autorizace Facebook Ads

Aby všechno správně fungovalo, je po vytvoření template třeba autorizovat účty na Facebook Ads a Google Ads.

V Components > My Configurations najděte svoji konfiguraci Facebook Ads.

{: .image-popup}
![Screenshot - facebook ads autorizace](/components/data-templates/e-commerce-shoptet/shoptet-22.png)

Autorizaci proveďte kliknutím na **Authorize Account**.

{: .image-popup}
![Screenshot - facebook ads autorizace description](/components/data-templates/e-commerce-shoptet/shoptet-23.png)

Vyplňte popisek a přihlašte se svým účtem ve Facebook Ads. Externí autorizace slouží k odesláni žádosti o ověření, pokud nemáte sami k účtu přístup.

{: .image-popup}
![Screenshot - facebook ads autorizace](/components/data-templates/e-commerce-shoptet/shoptet-24.png)

#### Autorizace Google Ads

Totéž je nutné udělat pro Google Ads. V Components > My Configurations vyhledejte svoji konfiguraci Google Ads.

{: .image-popup}
![Screenshot - google ads autorizace](/components/data-templates/e-commerce-shoptet/shoptet-25.png)

Zde následně autorizujte přístup ke Google Ads.

{: .image-popup}
![Screenshot - google ads autorizace](/components/data-templates/e-commerce-shoptet/shoptet-26.png)

### PowerBI

Zbývá se k datům připojit z Power BI a nastavit pravidelnou aktualizaci.

#### Získání uživatelských údajů pro Power BI

Přihlašovací údaje ke staženým datům najdete v Keboola Connection v Components > My Configurations > Snowflake data destination (konfiguraci najdete na konci seznamu, můžete použít vyhledávání).

{: .image-popup}
![Screenshot - získání snowflake credentials](/components/data-templates/e-commerce-shoptet/shoptet-27.png)

Klikněte na **Database Credentials**.

{: .image-popup}
![Screenshot - získání snowflake credentials](/components/data-templates/e-commerce-shoptet/shoptet-28.png)

Stránku Credentials si nechte otevřenou, za chvíli je budete vyplňovat do Power BI.

{: .image-popup}
![Screenshot -získání snowflake credentials](/components/data-templates/e-commerce-shoptet/shoptet-29.png)

#### Power BI pro uživatele Windows

Nainstalujte si poslední verzi Power BI Desktop. [https://powerbi.microsoft.com/cs-cz/desktop/](https://powerbi.microsoft.com/cs-cz/desktop/).

Stáhněte si [pbit template reportů](https://drive.google.com/file/d/1eMcqOUD6ehBSEhq3vHeDP1c-DHTEcD18/view?usp=sharing).

Po otevření template souboru vás Power BI vyzve k zadání parametrů.

{: .image-popup}
![Screenshot - power BI windows](/components/data-templates/e-commerce-shoptet/shoptet-30.png)

{: .image-popup}
![Screenshot - power BI windows](/components/data-templates/e-commerce-shoptet/shoptet-31.png)

Z Keboola Connection zkopírujte následující údaje do Power BI

- Hostname ⟶ SnowflakeHostname (např. keboola.west-europe.azure.snowflakecomputing.com)
- Database ⟶ SnowflakeDatabaseName (např. KEBOOLA_1234)
- Schema ⟶ SnowflakeSchema

 Po zadání parametrů klikněte na Načíst a po chvilce se vás Power BI zeptá na přihlašovací údaje. Ty najdete také v Keboola Connection na stránce [Credentials](#získání-uživatelských-údajů-pro-power-bi)

 {: .image-popup}
 ![Screenshot - power BI windows](/components/data-templates/e-commerce-shoptet/shoptet-32.png)

- Username ⟶ Uživatelské jméno
- Password ⟶ Heslo (zkopírujte ho kliknutím na tečky)
  
#### Power BI pro uživatele Mac

Stáhněte si mac powerbi [pbix](https://drive.google.com/file/d/13pfss7foIlnsgnVX3bkw-NCyB3blXwrB/view?usp=sharing).

Pokud nemáte Microsoft Office, stáhněte si i [fonty](https://ben.lobaugh.net/blog/204750/how-to-fix-missing-calibri-and-cambria-fonts-on-mac) od [Microsoftu](https://docs.microsoft.com/en-us/power-bi/fundamentals/power-bi-browsers).

Přihlaste se do [webového rozhraní Power BI](https://app.powerbi.com). [https://app.powerbi.com](https://app.powerbi.com)

V aplikaci klikněte vlevém kraji na ikonku člověk (pracovní prostor) a následně klikněte na tlačítko nový a násladně klikněte na tlačítko nahrát soubor.

 {: .image-popup}
 ![Screenshot - power BI mac](/components/data-templates/e-commerce-shoptet/shoptet-33.png)

Vyberte Místní soubor.

{: .image-popup}
![Screenshot - power BI mac](/components/data-templates/e-commerce-shoptet/shoptet-34.png)

Chvíli počkejte, než import doběhne.

{: .image-popup}
![Screenshot - power BI mac](/components/data-templates/e-commerce-shoptet/shoptet-35.png)

Nyní vás Power BI zavede do Pracovního prostoru (dostat se sem můžete i z menu nalevo).

{: .image-popup}
![Screenshot - power BI mac](/components/data-templates/e-commerce-shoptet/shoptet-36.png)

Abyste mohli nastavit propojení Power BI a Snowflake, rozklikněte datovou sadu a její nastavení.

{: .image-popup}
![Screenshot - power BI mac](/components/data-templates/e-commerce-shoptet/shoptet-37.png)

Nyní můžete začít nastavovat přihlašovací údaje a parametry.

{: .image-popup}
![Screenshot - snowflake credentials](/components/data-templates/e-commerce-shoptet/shoptet-38.png)

Přihlašovací údaje získáte na stránce [Credentials](#získání-uživatelských-údajů-pro-power-bi) v Keboola Connection.

{: .image-popup}
![Screenshot - power BI mac](/components/data-templates/e-commerce-shoptet/shoptet-39.png)

- Metoda ověřování: vyberte **basic**
- Username ⟶ Uživatelské jméno
- Password ⟶ Heslo (zkopírujte ho kliknutím na tečky).

Parametry zkopírujte z Keboola Connection.

{: .image-popup}
![Screenshot - power BI mac](/components/data-templates/e-commerce-shoptet/shoptet-40.png)
- Hostname ⟶ SnowflakeHostname
   (např. keboola.west-europe.azure.snowflakecomputing.com)
- Database ⟶ SnowflakeDatabaseName (např. KEBOOLA_1234)
- Schema ⟶ SnowflakeSchema

 Nastavit zde můžete i automatickou pravidelnou aktualizaci dat (k tomu bude nutné nastavit pravidelné spouštění orchestrace v Keboola Connection, jak je popsáno níže).

{: .image-popup}
![Screenshot - power BI mac aktualizace](/components/data-templates/e-commerce-shoptet/shoptet-41.png)

### Prohlížení Power BI

Svoji sestavu (tak Power BI nazývá reporty) najdete v [pracovním prostoru](https://app.powerbi.com) online [https://app.powerbi.com](https://app.powerbi.com).

### Nastavení pravidelné aktualizace dat

Keboola Connection naplánujte pravidelné spouštění orchestrace (všechny kroky ke stažení, vyčištění a sdílení dat do Snowflake).

Jděte do Orchestrations > Shoptet Ecommerce.

{: .image-popup}
![Screenshot - nastavení orchestace](/components/data-templates/e-commerce-shoptet/shoptet-42.png)

Nastavte Schedule.

{: .image-popup}
![Screenshot - nastavení orchestace](/components/data-templates/e-commerce-shoptet/shoptet-43.png)

Následně zvolte jak často se mají data aktualizovat.

{: .image-popup}
![Screenshot - nastavení orchestace](/components/data-templates/e-commerce-shoptet/shoptet-44.png)

V Power BI si nastavte pravidelnou aktualizaci dat.

{: .image-popup}
![Screenshot - nastavení aktualizace v Power BI](/components/data-templates/e-commerce-shoptet/shoptet-45.png)

Ideálně například hodinu po aktualizaci v Keboola Connection.

{: .image-popup}
![Screenshot - nastavení aktualizace v Power BI](/components/data-templates/e-commerce-shoptet/shoptet-46.png)

### A to je vše!

Dejte nám, prosím, vědět, jak se vám naše date templates líbí.
