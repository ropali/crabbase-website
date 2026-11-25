window.__docsSearchIndex = [
  {
    "title": "Getting started",
    "section": "",
    "href": "docs.html",
    "description": "This guide gets Crabbase running locally so you can use it as a ready-made backend — no custom REST code required. The only required external service is a PostgreSQL server (yours): everything else — API, admin dashboard, migrations — ships inside the single binary."
  },
  {
    "title": "Getting started",
    "section": "Prerequisites",
    "href": "docs.html#prerequisites",
    "description": "The dashboard&#39;s compiled JS/WASM assets are build artifacts (only the HTML shell is committed), so a fresh checkout must build them once with Trunk and..."
  },
  {
    "title": "Getting started",
    "section": "Configuration",
    "href": "docs.html#configuration",
    "description": "Crabbase is configured with a TOML file — default crabbase.toml in the working directory. Pass --config <path> to either subcommand to use a different file...."
  },
  {
    "title": "Getting started",
    "section": "Running",
    "href": "docs.html#running",
    "description": "admin serves its own API on the admin port (9898); the curl examples below use the standalone serve instance on 8989. Run both processes (they share..."
  },
  {
    "title": "Getting started",
    "section": "The two commands",
    "href": "docs.html#the-two-commands",
    "description": "Both commands run migrations and create any missing initial_users superusers before listening. You can run both at once against the same database; in..."
  },
  {
    "title": "Getting started",
    "section": "What happens on boot",
    "href": "docs.html#what-happens-on-boot",
    "description": "Logging initializes — pretty console logs filtered by RUST_LOG , plus daily-rotating JSON logs written to logs/app.log ."
  },
  {
    "title": "Getting started",
    "section": "First steps",
    "href": "docs.html#first-steps",
    "description": "The dashboard can run separately from your public API server — both keep application state in Postgres (use S3-compatible storage or a shared volume if you..."
  },
  {
    "title": "Getting started",
    "section": "Makefile reference",
    "href": "docs.html#makefile-reference",
    "description": ""
  },
  {
    "title": "Getting started",
    "section": "Troubleshooting",
    "href": "docs.html#troubleshooting",
    "description": "Config file not found / invalid TOML — check the path passed to --config and the [database] , [server] , and [admin] sections."
  },
  {
    "title": "Collections & records",
    "section": "",
    "href": "docs-collections.html",
    "description": "Collections are the heart of Crabbase. A collection is a real PostgreSQL table that you define at runtime — and the moment it exists, a full REST CRUD surface is generated for it at /api/collections/{name}/records . This is how you build a backend without writing any API code."
  },
  {
    "title": "Collections & records",
    "section": "The easy way: the admin dashboard",
    "href": "docs-collections.html#the-easy-way-the-admin-dashboard",
    "description": "Everything in this document can be done from the admin dashboard ( crabbase admin , default http://localhost:9898 ) — no curl required:"
  },
  {
    "title": "Collections & records",
    "section": "Endpoints",
    "href": "docs-collections.html#endpoints",
    "description": "* Record endpoints enforce collection rules: list_rule on list, view_rule on single-record fetch and relation expansion, create_rule on create/upload, and..."
  },
  {
    "title": "Collections & records",
    "section": "Creating a collection",
    "href": "docs-collections.html#creating-a-collection",
    "description": "The Relation field requires the categories collection to exist first; create it before running this example, or drop that field."
  },
  {
    "title": "Collections & records",
    "section": "Field types ( data_type )",
    "href": "docs-collections.html#field-types-datatype",
    "description": "Legacy aliases are accepted for compatibility: text , richtext / editor , int / integer , bool / boolean , date , autodate , etc. (case-insensitive)."
  },
  {
    "title": "Collections & records",
    "section": "Column options",
    "href": "docs-collections.html#column-options",
    "description": ""
  },
  {
    "title": "Collections & records",
    "section": "Built-in columns",
    "href": "docs-collections.html#built-in-columns",
    "description": "You cannot create columns named id , created , or updated . Collection names must be valid identifiers ( [A-Za-z_][A-Za-z0-9_]* ), and each collection gets..."
  },
  {
    "title": "Collections & records",
    "section": "Collection types",
    "href": "docs-collections.html#collection-types",
    "description": "auth — records can log in; see Authentication"
  },
  {
    "title": "Collections & records",
    "section": "Updating schema (live migration)",
    "href": "docs-collections.html#updating-schema-live-migration",
    "description": "PATCH /api/collections/{name} performs an online schema change: renames the table if you pass name , adds/drops/retypes columns per the new columns list,..."
  },
  {
    "title": "Collections & records",
    "section": "Working with records",
    "href": "docs-collections.html#working-with-records",
    "description": "Records are addressed through the auto-generated endpoints. Payloads use a data envelope; id , created , and updated are managed by the system and returned..."
  },
  {
    "title": "Collections & records",
    "section": "File Storage & Attachments",
    "href": "docs-collections.html#file-storage-attachments",
    "description": "Collections support File field types for storing file references (images, documents, archives). The file management workflow is integrated with collections...."
  },
  {
    "title": "Collections & records",
    "section": "1. Uploading Files for a Collection",
    "href": "docs-collections.html#1-uploading-files-for-a-collection",
    "description": "Upload one or multiple files using multipart form data to /api/collections/{name}/records/upload (the only upload endpoint; POST..."
  },
  {
    "title": "Collections & records",
    "section": "2. Creating or Updating Records with Files",
    "href": "docs-collections.html#2-creating-or-updating-records-with-files",
    "description": "Use the returned file ID or storage key when creating or updating records:"
  },
  {
    "title": "Collections & records",
    "section": "3. Automatic Cleanup",
    "href": "docs-collections.html#3-automatic-cleanup",
    "description": "Update : If a file field is replaced with a new file or cleared, the old file record and its storage bytes are automatically purged from the backend."
  },
  {
    "title": "Collections & records",
    "section": "4. Listing Files in a Collection",
    "href": "docs-collections.html#4-listing-files-in-a-collection",
    "description": "Retrieve all files belonging to a collection:"
  },
  {
    "title": "Collections & records",
    "section": "5. Downloading / Viewing Collection Files",
    "href": "docs-collections.html#5-downloading-viewing-collection-files",
    "description": "Governed by the collection&#39;s view_rule . Files can also be fetched from /api/files/<file_id> , where the file&#39;s own collection supplies the rule...."
  },
  {
    "title": "Collections & records",
    "section": "Dynamic record filtering ( ?filter )",
    "href": "docs-collections.html#dynamic-record-filtering-filter",
    "description": "Crabbase supports client-side dynamic record filtering on GET /api/collections/{name}/records with full PocketBase compatibility. Clients can filter records..."
  },
  {
    "title": "Collections & records",
    "section": "Quick Examples",
    "href": "docs-collections.html#quick-examples",
    "description": ""
  },
  {
    "title": "Collections & records",
    "section": "Supported Operators",
    "href": "docs-collections.html#supported-operators",
    "description": ""
  },
  {
    "title": "Collections & records",
    "section": "Literal Types & Escaping",
    "href": "docs-collections.html#literal-types-escaping",
    "description": "Strings : &#39;single-quoted&#39; or \"double-quoted\" (supports \\&#39; and \\\" escaping)."
  },
  {
    "title": "Collections & records",
    "section": "Context Macros",
    "href": "docs-collections.html#context-macros",
    "description": "@request.auth.<field> — Dynamically resolved from the authenticated record&#39;s JWT claims (e.g. @request.auth.id , @request.auth.email )."
  },
  {
    "title": "Collections & records",
    "section": "Security & Access Control Interaction",
    "href": "docs-collections.html#security-access-control-interaction",
    "description": "The client filter works alongside the collection&#39;s access control ( list_rule ):"
  },
  {
    "title": "Collections & records",
    "section": "Client Library / JavaScript Usage",
    "href": "docs-collections.html#client-library-javascript-usage",
    "description": ""
  },
  {
    "title": "Collections & records",
    "section": "Searching & Filtering in the Admin Dashboard",
    "href": "docs-collections.html#searching-filtering-in-the-admin-dashboard",
    "description": "In the Crabbase Admin Dashboard ( crabbase admin ):"
  },
  {
    "title": "Collections & records",
    "section": "Relations",
    "href": "docs-collections.html#relations",
    "description": "Define them at creation time; Crabbase creates a real foreign key:"
  },
  {
    "title": "Collections & records",
    "section": "Expanding relations ( ?expand )",
    "href": "docs-collections.html#expanding-relations-expand",
    "description": "Crabbase supports expanding relation fields inline on both list ( GET /api/collections/{name}/records ) and single-record ( GET..."
  },
  {
    "title": "Collections & records",
    "section": "Quick Examples",
    "href": "docs-collections.html#quick-examples-2",
    "description": ""
  },
  {
    "title": "Collections & records",
    "section": "Response Payload Structure",
    "href": "docs-collections.html#response-payload-structure",
    "description": "When ?expand is specified, each expanded relation is embedded into a top-level expand object on the record, keyed by the relation field name:"
  },
  {
    "title": "Collections & records",
    "section": "Security, Authorization & Privacy Invariants",
    "href": "docs-collections.html#security-authorization-privacy-invariants",
    "description": "Expanding relations across collection boundaries can easily introduce Insecure Direct Object References (IDOR) or leak hidden columns if not strictly..."
  },
  {
    "title": "Collections & records",
    "section": "Performance & Database Architecture",
    "href": "docs-collections.html#performance-database-architecture",
    "description": "Crabbase implements relation expansion with connection-pool friendliness and zero $N+1$ query overhead:"
  },
  {
    "title": "Collections & records",
    "section": "Client Integration Examples",
    "href": "docs-collections.html#client-integration-examples",
    "description": ""
  },
  {
    "title": "Collections & records",
    "section": "API rules",
    "href": "docs-collections.html#api-rules",
    "description": "Each collection stores rule strings — list_rule , view_rule , create_rule , update_rule , delete_rule — written in a PocketBase-style filter language,..."
  },
  {
    "title": "Authentication",
    "section": "",
    "href": "docs-authentication.html",
    "description": "Crabbase ships a complete JWT auth system that works per collection — no code required. Any collection marked as type auth becomes login-capable; the built-in _superusers collection is used for admin access."
  },
  {
    "title": "Authentication",
    "section": "Auth collections",
    "href": "docs-authentication.html#auth-collections",
    "description": "Create an auth collection — in the dashboard&#39;s Create Collection drawer, pick type Auth ; or via API:"
  },
  {
    "title": "Authentication",
    "section": "Registering users",
    "href": "docs-authentication.html#registering-users",
    "description": "There is no dedicated registration endpoint yet. The easiest way to create users is through the admin dashboard : open the auth collection in the sidebar..."
  },
  {
    "title": "Authentication",
    "section": "Endpoints",
    "href": "docs-authentication.html#endpoints",
    "description": ""
  },
  {
    "title": "Authentication",
    "section": "Login",
    "href": "docs-authentication.html#login",
    "description": "Access tokens default to 1 hour; collections created through the API get a 5-day duration in their options (the seeded _superusers collection uses the..."
  },
  {
    "title": "Authentication",
    "section": "Calling authenticated endpoints",
    "href": "docs-authentication.html#calling-authenticated-endpoints",
    "description": "Send the access token as a bearer token:"
  },
  {
    "title": "Authentication",
    "section": "File tokens",
    "href": "docs-authentication.html#file-tokens",
    "description": "Protected file downloads often happen in <img> or <a> tags, where you cannot set an Authorization header. Exchange the access token for a short-lived file..."
  },
  {
    "title": "Authentication",
    "section": "Refreshing tokens",
    "href": "docs-authentication.html#refreshing-tokens",
    "description": "Refresh uses rotation with reuse detection : every refresh invalidates the old token and issues a new pair; reusing an already-rotated token revokes the..."
  },
  {
    "title": "Authentication",
    "section": "Logout",
    "href": "docs-authentication.html#logout",
    "description": "Revokes the entire refresh-token family for that session:"
  },
  {
    "title": "Authentication",
    "section": "Password reset (email OTP)",
    "href": "docs-authentication.html#password-reset-email-otp",
    "description": "Requires SMTP to be configured first — see Settings & email ."
  },
  {
    "title": "Authentication",
    "section": "Superusers",
    "href": "docs-authentication.html#superusers",
    "description": "The _superusers collection is created by migrations; missing [[initial_users]] entries are created at boot (existing emails are left untouched)."
  },
  {
    "title": "Authentication",
    "section": "Security notes",
    "href": "docs-authentication.html#security-notes",
    "description": "Tokens: HS256 JWTs; the effective secret is {collection secret}-{user token_key} , so changing a user&#39;s token_key invalidates their existing tokens."
  },
  {
    "title": "Files & uploads",
    "section": "",
    "href": "docs-files.html",
    "description": "Crabbase has built-in file storage. A File column stores a reference to an uploaded object; the bytes live on local disk or in S3, and downloads are served through Crabbase so the collection&#39;s view_rule is always enforced."
  },
  {
    "title": "Files & uploads",
    "section": "Quick start",
    "href": "docs-files.html#quick-start",
    "description": "If view_rule is not empty, step 4 also needs authenticated access: a Bearer token for server-side requests, or a file token for browser media tags. See..."
  },
  {
    "title": "Files & uploads",
    "section": "Defining file columns",
    "href": "docs-files.html#defining-file-columns",
    "description": "Add a column with \"data_type\": \"File\" when creating or updating a collection:"
  },
  {
    "title": "Files & uploads",
    "section": "File column options",
    "href": "docs-files.html#file-column-options",
    "description": "Constraints are applied at upload time only when the multipart part name matches a file column. min is checked when the record is created or updated,..."
  },
  {
    "title": "Files & uploads",
    "section": "Uploading files",
    "href": "docs-files.html#uploading-files",
    "description": "The request must be multipart/form-data . Authentication is governed by the collection&#39;s create_rule :"
  },
  {
    "title": "Files & uploads",
    "section": "Basic upload",
    "href": "docs-files.html#basic-upload",
    "description": "Use the returned id when linking the file to a record. The key also works as a reference, but id is the canonical choice."
  },
  {
    "title": "Files & uploads",
    "section": "Field names matter",
    "href": "docs-files.html#field-names-matter",
    "description": "Name each multipart part after a File column to apply that column&#39;s constraints:"
  },
  {
    "title": "Files & uploads",
    "section": "Multiple files",
    "href": "docs-files.html#multiple-files",
    "description": "The response contains one entry per part, in order."
  },
  {
    "title": "Files & uploads",
    "section": "Upload limits",
    "href": "docs-files.html#upload-limits",
    "description": "The entire request body is capped at 100 MB , including all parts."
  },
  {
    "title": "Files & uploads",
    "section": "Attaching files to records",
    "href": "docs-files.html#attaching-files-to-records",
    "description": "When a record is read back, file references are replaced with their metadata objects ( id , key , originalName , contentType , sizeBytes , ...):"
  },
  {
    "title": "Files & uploads",
    "section": "Lifecycle and cleanup",
    "href": "docs-files.html#lifecycle-and-cleanup",
    "description": "Replacing a file, removing an item from a multi-file array, or clearing the field deletes the old bytes and its _files metadata row."
  },
  {
    "title": "Files & uploads",
    "section": "Listing and downloading files",
    "href": "docs-files.html#listing-and-downloading-files",
    "description": ""
  },
  {
    "title": "Files & uploads",
    "section": "Download URLs",
    "href": "docs-files.html#download-urls",
    "description": "A file can be fetched by id or storage key from two equivalent places:"
  },
  {
    "title": "Files & uploads",
    "section": "Listing a collection&#39;s files",
    "href": "docs-files.html#listing-a-collection39s-files",
    "description": "Governed by the collection&#39;s list_rule . The response includes every file uploaded for the collection, including files not yet attached to a record:"
  },
  {
    "title": "Files & uploads",
    "section": "Protected files",
    "href": "docs-files.html#protected-files",
    "description": "File access is decided by the owning collection&#39;s view_rule :"
  },
  {
    "title": "Files & uploads",
    "section": "File tokens",
    "href": "docs-files.html#file-tokens",
    "description": "Browsers cannot attach an Authorization header to <img> , <video> , or <a download> requests. For protected files, exchange the normal Bearer token for a..."
  },
  {
    "title": "Files & uploads",
    "section": "JavaScript example",
    "href": "docs-files.html#javascript-example",
    "description": "The admin dashboard performs this exchange automatically for file previews and download links."
  },
  {
    "title": "Files & uploads",
    "section": "Storage configuration",
    "href": "docs-files.html#storage-configuration",
    "description": "New uploads go to the storage configured in Settings → File storage in the admin dashboard, or through the admin-only settings API."
  },
  {
    "title": "Files & uploads",
    "section": "Local disk",
    "href": "docs-files.html#local-disk",
    "description": "basePath is relative to the server&#39;s working directory unless absolute. A leading $HOME is expanded at runtime. The directory must be writable by the..."
  },
  {
    "title": "Files & uploads",
    "section": "S3-compatible storage",
    "href": "docs-files.html#s3-compatible-storage",
    "description": "Existing files are not migrated when the storage setting changes. Each file&#39;s _files row records its backend and container, so old files stay readable..."
  },
  {
    "title": "Files & uploads",
    "section": "Limits and caveats",
    "href": "docs-files.html#limits-and-caveats",
    "description": "Per-file size limits come from max_size on the column, in bytes."
  },
  {
    "title": "Files & uploads",
    "section": "Troubleshooting",
    "href": "docs-files.html#troubleshooting",
    "description": ""
  },
  {
    "title": "Settings & email",
    "section": "",
    "href": "docs-settings.html",
    "description": "Crabbase stores runtime configuration in a key/value settings table ( _settings ). You can manage all of it from the admin dashboard — no code, no curl, no restarts:"
  },
  {
    "title": "Settings & email",
    "section": "Mail settings",
    "href": "docs-settings.html#mail-settings",
    "description": "TLS behavior: implicit TLS is used on port 465; otherwise STARTTLS. Once saved, password-reset emails work immediately — no restart needed."
  },
  {
    "title": "Settings & email",
    "section": "App settings",
    "href": "docs-settings.html#app-settings",
    "description": "GET /api/settings/app returns 204 No Content if nothing has been saved yet."
  },
  {
    "title": "Settings & email",
    "section": "Email templates",
    "href": "docs-settings.html#email-templates",
    "description": "Two templates are seeded by migrations and fully editable:"
  },
  {
    "title": "Settings & email",
    "section": "Template variables",
    "href": "docs-settings.html#template-variables",
    "description": "Save via POST /api/settings/email-templates with the full EmailTemplates payload you got from the GET ."
  },
  {
    "title": "Backups & cron jobs",
    "section": "",
    "href": "docs-backups.html",
    "description": "Crabbase runs one durable Postgres job queue. Crons are producers that enqueue jobs; a backup is one job handler. There is no Redis and no external cron."
  },
  {
    "title": "Backups & cron jobs",
    "section": "How it fits together",
    "href": "docs-backups.html#how-it-fits-together",
    "description": "Built-in handlers: backup.create , backups.prune , logs.cleanup , otp.cleanup , db.vacuum ."
  },
  {
    "title": "Backups & cron jobs",
    "section": "Configuration",
    "href": "docs-backups.html#configuration",
    "description": "Backup and job runtime settings live in the _settings table as JSON, not in crabbase.toml . They can be read and updated from the admin API:"
  },
  {
    "title": "Backups & cron jobs",
    "section": "Schedule semantics",
    "href": "docs-backups.html#schedule-semantics",
    "description": "All times are UTC. next_run is computed from database time."
  },
  {
    "title": "Backups & cron jobs",
    "section": "API",
    "href": "docs-backups.html#api",
    "description": "All routes are admin-only ( _superusers )."
  },
  {
    "title": "Backups & cron jobs",
    "section": "Retention policy",
    "href": "docs-backups.html#retention-policy",
    "description": "backups.prune runs daily at 04:00 UTC with {\"keepDays\": 14} . It deletes completed backups older than the window except the newest successful one . Rows are..."
  },
  {
    "title": "Backups & cron jobs",
    "section": "Restore runbook (manual, never in place)",
    "href": "docs-backups.html#restore-runbook-manual-never-in-place",
    "description": "Restoring over a live database from the dashboard is deliberately unsupported."
  },
  {
    "title": "Backups & cron jobs",
    "section": "Operations",
    "href": "docs-backups.html#operations",
    "description": "The reaper will requeue it after the lease expires. To force it:"
  },
  {
    "title": "Backups & cron jobs",
    "section": "Scaling notes",
    "href": "docs-backups.html#scaling-notes",
    "description": "Run multiple schedulers and workers safely: row locks, a unique dedupe_key , and the locked_by fencing token prevent duplicate execution."
  }
];
