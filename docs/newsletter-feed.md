# Newsletter feed (Mailchimp RSS)

This site uses an RSS feed to send newsletters through Mailchimp.

Feed URL
- https://crosscountryevangelism.com/newsletter.xml

Add a new newsletter
1) Create the page: `newsletters/YYYY-MM.html` (one per month).
2) Add it to the archive in `newsletter.html` (link it in the list and optionally update the "Latest Newsletter" section).
3) Update `newsletter.xml` with a new `<item>`:
   - `title`, `link`, `guid`, `pubDate`, `description`
   - `media:content` should use the first photo as the featured image
   - `content:encoded` should include the full newsletter HTML and image tags
4) Deploy the site.

Mailchimp setup (send to all subscribers on new issue)
1) Automations → Customer Journeys → Create from template → "Share blog updates" (RSS).
2) RSS Feed URL: `https://crosscountryevangelism.com/newsletter.xml`.
3) Schedule: daily (or your preference).
4) In the email template:
   - `*|RSSITEM:CONTENT_FULL|*` for full content
   - `*|RSSITEM:IMAGE|*` for the featured image
5) Set "Number of posts to show" = 1.
6) Start the automation.
