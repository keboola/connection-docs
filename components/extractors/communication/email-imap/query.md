---
title: IMAP Query Syntax
permalink: /components/extractors/communication/email-imap/query-syntax/
---


To combine multiple keywords enclose the query in brackets, 
e.g. the following matchess all unseen emails received from address `sender-email@example.com` with subject `the subject`: 
`(FROM "sender-email@example.com" SUBJECT "the subject" UNSEEN)`

## Keywords

* TOC
{:toc}


### ALL

    All messages in the mailbox; the default initial key for
	ANDing.

### ANSWERED

	Messages with the \Answered flag set.

### BCC 

	Messages that contain the specified string in the envelope
	structure's BCC field.

### BEFORE
 
	Messages whose internal date (disregarding time and timezone)
	is earlier than the specified date.

### BODY
 
	Messages that contain the specified string in the body of the
	message.

### CC
 
	Messages that contain the specified string in the envelope
	structure's CC field.

### DELETED

	Messages with the \Deleted flag set.

### DRAFT

	Messages with the \Draft flag set.

### FLAGGED

	Messages with the \Flagged flag set.

### FROM 

	Messages that contain the specified string in the envelope
	structure's FROM field.

### HEADER
  
	Messages that have a header with the specified field-name (as
	defined in [RFC-2822]) and that contains the specified string
	in the text of the header (what comes after the colon).  If the
	string to search is zero-length, this matches all messages that
	have a header line with the specified field-name regardless of
	the contents.

### KEYWORD 

	Messages with the specified keyword flag set.

### LARGER 

	Messages with an [RFC-2822] size larger than the specified
	number of octets.

### NEW

	Messages that have the \Recent flag set but not the \Seen flag.
	This is functionally equivalent to "(RECENT UNSEEN)".

### NOT
 
	Messages that do not match the specified search key.

### OLD

	Messages that do not have the \Recent flag set.  This is
	functionally equivalent to "NOT RECENT" (as opposed to "NOT
	NEW").

### ON
 
	Messages whose internal date (disregarding time and timezone)
	is within the specified date.

### OR
  
	Messages that match either search key.

### RECENT

	Messages that have the \Recent flag set.

### SEEN

	Messages that have the \Seen flag set.

### SENTBEFORE
 
	Messages whose [RFC-2822] Date: header (disregarding time and
	timezone) is earlier than the specified date.

### SENTON
 
	Messages whose [RFC-2822] Date: header (disregarding time and
	timezone) is within the specified date.

### SENTSINCE
 
	Messages whose [RFC-2822] Date: header (disregarding time and
	timezone) is within or later than the specified date.

### SINCE
 
	Messages whose internal date (disregarding time and timezone)
	is within or later than the specified date.

### SMALLER
 
	Messages with an [RFC-2822] size smaller than the specified
	number of octets.

### SUBJECT
 
	Messages that contain the specified string in the envelope
	structure's SUBJECT field.

### TEXT
 
	Messages that contain the specified string in the header or
	body of the message.

### TO
 
	Messages that contain the specified string in the envelope
	structure's TO field.

### UID
 
	Messages with unique identifiers corresponding to the specified
	unique identifier set.  Sequence set ranges are permitted.

### UNANSWERED

	Messages that do not have the \Answered flag set.

### UNDELETED

	Messages that do not have the \Deleted flag set.

### UNDRAFT

	Messages that do not have the \Draft flag set.

### UNFLAGGED

	Messages that do not have the \Flagged flag set.

### UNKEYWORD
 
	Messages that do not have the specified keyword flag set.

### UNSEEN

	Messages that do not have the \Seen flag set.