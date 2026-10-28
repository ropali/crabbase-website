window.__docsSearchIndex = [
  {
    "title": "Getting Started",
    "section": "",
    "href": "docs.html",
    "description": "Get Crabbase running locally with PostgreSQL, the REST API, and the admin dashboard."
  },
  {
    "title": "Getting Started",
    "section": "Installation",
    "href": "docs.html#installation",
    "description": "Build from source with Make or Cargo, or build the dashboard assets once for a fresh checkout."
  },
  {
    "title": "Getting Started",
    "section": "Prerequisites",
    "href": "docs.html#prerequisites",
    "description": "Rust stable, PostgreSQL 14+, Trunk, and the wasm32-unknown-unknown target."
  },
  {
    "title": "Getting Started",
    "section": "How Crabbase runs",
    "href": "docs.html#how-it-runs",
    "description": "One executable fronts PostgreSQL and serves the API plus admin dashboard."
  },
  {
    "title": "Getting Started",
    "section": "Configuration",
    "href": "docs.html#configuration",
    "description": "The crabbase.toml file, database, server, admin, and initial superuser settings."
  },
  {
    "title": "Getting Started",
    "section": "Running",
    "href": "docs.html#running",
    "description": "crabbase serve and crabbase admin, plus the boot sequence."
  },
  {
    "title": "Getting Started",
    "section": "First steps",
    "href": "docs.html#first-steps",
    "description": "Open the dashboard, create a collection, set rules, and query the REST API."
  },
  {
    "title": "Getting Started",
    "section": "Makefile reference",
    "href": "docs.html#makefile-reference",
    "description": "Every common development and release task."
  },
  {
    "title": "Getting Started",
    "section": "Troubleshooting",
    "href": "docs.html#troubleshooting",
    "description": "Common startup and Postgres connection issues."
  },
  {
    "title": "Collections & Records",
    "section": "",
    "href": "docs-collections.html",
    "description": "Collections are the heart of Crabbase. A collection is a real PostgreSQL table that you define at runtime — and the moment it exists, a full REST CRUD surface is generated for it at /api/collections/{name}/records. This is how you build a backend without writing any API code."
  },
  {
    "title": "Collections & Records",
    "section": "The easy way: the admin dashboard",
    "href": "docs-collections.html#the-easy-way-the-admin-dashboard",
    "description": "Everything in this document can be done from the admin dashboard (crabbase admin, default http://localhost:9898) — no curl required:"
  },
  {
    "title": "Collections & Records",
    "section": "Endpoints",
    "href": "docs-collections.html#endpoints",
    "description": "* Record endpoints enforce collection rules: list_rule on list, view_rule on single-record fetch and relation expansion, create_rule on create/upload, and..."
  },
  {
    "title": "Collections & Records",
    "section": "Creating a collection",
    "href": "docs-collections.html#creating-a-collection",
    "description": "The Relation field requires the categories collection to exist first; create it before running this example, or drop that field."
  },
  {
    "title": "Collections & Records",
    "section": "Field types (data_type)",
    "href": "docs-collections.html#field-types-data-type",
    "description": "Legacy aliases are accepted for compatibility: text, richtext/editor, int/integer, bool/boolean, date, autodate, etc. (case-insensitive)."
  },
  {
    "title": "Collections & Records",
    "section": "Column options",
    "href": "docs-collections.html#column-options",
    "description": ""
  },
  {
    "title": "Collections & Records",
    "section": "Built-in columns",
    "href": "docs-collections.html#built-in-columns",
    "description": "You cannot create columns named id, created, or updated. Collection names must be valid identifiers ([A-Za-z_][A-Za-z0-9_]*), and each collection gets its..."
  },
  {
    "title": "Collections & Records",
    "section": "Collection types",
    "href": "docs-collections.html#collection-types",
    "description": "auth — records can log in; see Authentication"
  },
  {
    "title": "Collections & Records",
    "section": "Updating schema (live migration)",
    "href": "docs-collections.html#updating-schema-live-migration",
    "description": "PATCH /api/collections/{name} performs an online schema change: renames the table if you pass name, adds/drops/retypes columns per the new columns list,..."
  },
  {
    "title": "Collections & Records",
    "section": "Working with records",
    "href": "docs-collections.html#working-with-records",
    "description": "Records are addressed through the auto-generated endpoints. Payloads use a data envelope; id, created, and updated are managed by the system and returned on..."
  },
  {
    "title": "Collections & Records",
    "section": "File Storage & Attachments",
    "href": "docs-collections.html#file-storage-attachments",
    "description": "Collections support File field types for storing file references (images, documents, archives). The file management workflow is integrated with collections...."
  },
  {
    "title": "Collections & Records",
    "section": "1. Uploading Files for a Collection",
    "href": "docs-collections.html#1-uploading-files-for-a-collection",
    "description": "Upload one or multiple files using multipart form data to /api/collections/{name}/records/upload (the only upload endpoint; POST..."
  },
  {
    "title": "Collections & Records",
    "section": "2. Creating or Updating Records with Files",
    "href": "docs-collections.html#2-creating-or-updating-records-with-files",
    "description": "Use the returned file ID or storage key when creating or updating records:"
  },
  {
    "title": "Collections & Records",
    "section": "3. Automatic Cleanup",
    "href": "docs-collections.html#3-automatic-cleanup",
    "description": "Update: If a file field is replaced with a new file or cleared, the old file record and its storage bytes are automatically purged from the backend."
  },
  {
    "title": "Collections & Records",
    "section": "4. Listing Files in a Collection",
    "href": "docs-collections.html#4-listing-files-in-a-collection",
    "description": "Retrieve all files belonging to a collection:"
  },
  {
    "title": "Collections & Records",
    "section": "5. Downloading / Viewing Collection Files",
    "href": "docs-collections.html#5-downloading-viewing-collection-files",
    "description": "Governed by the collection's view_rule. Files can also be fetched from /api/files/<file_id>, where the file's own collection supplies the rule. For..."
  },
  {
    "title": "Collections & Records",
    "section": "Dynamic record filtering (?filter)",
    "href": "docs-collections.html#dynamic-record-filtering-filter",
    "description": "Crabbase supports client-side dynamic record filtering on GET /api/collections/{name}/records with full PocketBase compatibility. Clients can filter records..."
  },
  {
    "title": "Collections & Records",
    "section": "Quick Examples",
    "href": "docs-collections.html#quick-examples",
    "description": ""
  },
  {
    "title": "Collections & Records",
    "section": "Supported Operators",
    "href": "docs-collections.html#supported-operators",
    "description": ""
  },
  {
    "title": "Collections & Records",
    "section": "Literal Types & Escaping",
    "href": "docs-collections.html#literal-types-escaping",
    "description": "Strings: 'single-quoted' or \"double-quoted\" (supports \\' and \\\" escaping)."
  },
  {
    "title": "Collections & Records",
    "section": "Context Macros",
    "href": "docs-collections.html#context-macros",
    "description": "@request.auth.<field> — Dynamically resolved from the authenticated record's JWT claims (e.g. @request.auth.id, @request.auth.email)."
  },
  {
    "title": "Collections & Records",
    "section": "Security & Access Control Interaction",
    "href": "docs-collections.html#security-access-control-interaction",
    "description": "The client filter works alongside the collection's access control (list_rule):"
  },
  {
    "title": "Collections & Records",
    "section": "Client Library / JavaScript Usage",
    "href": "docs-collections.html#client-library-javascript-usage",
    "description": ""
  },
  {
    "title": "Collections & Records",
    "section": "Searching & Filtering in the Admin Dashboard",
    "href": "docs-collections.html#searching-filtering-in-the-admin-dashboard",
    "description": "In the Crabbase Admin Dashboard (crabbase admin):"
  },
  {
    "title": "Collections & Records",
    "section": "Relations",
    "href": "docs-collections.html#relations",
    "description": "Define them at creation time; Crabbase creates a real foreign key:"
  },
  {
    "title": "Collections & Records",
    "section": "Expanding relations (?expand)",
    "href": "docs-collections.html#expanding-relations-expand",
    "description": "Crabbase supports expanding relation fields inline on both list (GET /api/collections/{name}/records) and single-record (GET..."
  },
  {
    "title": "Collections & Records",
    "section": "Quick Examples",
    "href": "docs-collections.html#quick-examples-2",
    "description": ""
  },
  {
    "title": "Collections & Records",
    "section": "Response Payload Structure",
    "href": "docs-collections.html#response-payload-structure",
    "description": "When ?expand is specified, each expanded relation is embedded into a top-level expand object on the record, keyed by the relation field name:"
  },
  {
    "title": "Collections & Records",
    "section": "Security, Authorization & Privacy Invariants",
    "href": "docs-collections.html#security-authorization-privacy-invariants",
    "description": "Expanding relations across collection boundaries can easily introduce Insecure Direct Object References (IDOR) or leak hidden columns if not strictly..."
  },
  {
    "title": "Collections & Records",
    "section": "Performance & Database Architecture",
    "href": "docs-collections.html#performance-database-architecture",
    "description": "Crabbase implements relation expansion with connection-pool friendliness and zero $N+1$ query overhead:"
  },
  {
    "title": "Collections & Records",
    "section": "Client Integration Examples",
    "href": "docs-collections.html#client-integration-examples",
    "description": ""
  },
  {
    "title": "Collections & Records",
    "section": "API rules",
    "href": "docs-collections.html#api-rules",
    "description": "Each collection stores rule strings — list_rule, view_rule, create_rule, update_rule, delete_rule — written in a PocketBase-style filter language, compiled..."
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
    "description": "Create an auth collection — in the dashboard's Create Collection drawer, pick type Auth; or via API:"
  },
  {
    "title": "Authentication",
    "section": "Registering users",
    "href": "docs-authentication.html#registering-users",
    "description": "There is no dedicated registration endpoint yet. The easiest way to create users is through the admin dashboard: open the auth collection in the sidebar and..."
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
    "description": "Refresh uses rotation with reuse detection: every refresh invalidates the old token and issues a new pair; reusing an already-rotated token revokes the..."
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
    "description": "Requires SMTP to be configured first — see Settings & email."
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
    "description": "Tokens: HS256 JWTs; the effective secret is {collection secret}-{user token_key}, so changing a user's token_key invalidates their existing tokens."
  },
  {
    "title": "Files & Uploads",
    "section": "",
    "href": "docs-files.html",
    "description": "Crabbase has built-in file storage. A File column stores a reference to an uploaded object; the bytes live on local disk or in S3, and downloads are served through Crabbase so the collection's view_rule is always enforced."
  },
  {
    "title": "Files & Uploads",
    "section": "Quick start",
    "href": "docs-files.html#quick-start",
    "description": "If view_rule is not empty, step 4 also needs authenticated access: a Bearer token for server-side requests, or a file token for browser media tags. See..."
  },
  {
    "title": "Files & Uploads",
    "section": "Defining file columns",
    "href": "docs-files.html#defining-file-columns",
    "description": "Add a column with \"data_type\": \"File\" when creating or updating a collection:"
  },
  {
    "title": "Files & Uploads",
    "section": "File column options",
    "href": "docs-files.html#file-column-options",
    "description": "Constraints are applied at upload time only when the multipart part name matches a file column. min is checked when the record is created or updated,..."
  },
  {
    "title": "Files & Uploads",
    "section": "Uploading files",
    "href": "docs-files.html#uploading-files",
    "description": "The request must be multipart/form-data. Authentication is governed by the collection's create_rule:"
  },
  {
    "title": "Files & Uploads",
    "section": "Basic upload",
    "href": "docs-files.html#basic-upload",
    "description": "Use the returned id when linking the file to a record. The key also works as a reference, but id is the canonical choice."
  },
  {
    "title": "Files & Uploads",
    "section": "Field names matter",
    "href": "docs-files.html#field-names-matter",
    "description": "Name each multipart part after a File column to apply that column's constraints:"
  },
  {
    "title": "Files & Uploads",
    "section": "Multiple files",
    "href": "docs-files.html#multiple-files",
    "description": "The response contains one entry per part, in order."
  },
  {
    "title": "Files & Uploads",
    "section": "Upload limits",
    "href": "docs-files.html#upload-limits",
    "description": "The entire request body is capped at 100 MB, including all parts."
  },
  {
    "title": "Files & Uploads",
    "section": "Attaching files to records",
    "href": "docs-files.html#attaching-files-to-records",
    "description": "When a record is read back, file references are replaced with their metadata objects (id, key, originalName, contentType, sizeBytes, ...):"
  },
  {
    "title": "Files & Uploads",
    "section": "Lifecycle and cleanup",
    "href": "docs-files.html#lifecycle-and-cleanup",
    "description": "Replacing a file, removing an item from a multi-file array, or clearing the field deletes the old bytes and its _files metadata row."
  },
  {
    "title": "Files & Uploads",
    "section": "Listing and downloading files",
    "href": "docs-files.html#listing-and-downloading-files",
    "description": ""
  },
  {
    "title": "Files & Uploads",
    "section": "Download URLs",
    "href": "docs-files.html#download-urls",
    "description": "A file can be fetched by id or storage key from two equivalent places:"
  },
  {
    "title": "Files & Uploads",
    "section": "Listing a collection's files",
    "href": "docs-files.html#listing-a-collection-s-files",
    "description": "Governed by the collection's list_rule. The response includes every file uploaded for the collection, including files not yet attached to a record:"
  },
  {
    "title": "Files & Uploads",
    "section": "Protected files",
    "href": "docs-files.html#protected-files",
    "description": "File access is decided by the owning collection's view_rule:"
  },
  {
    "title": "Files & Uploads",
    "section": "File tokens",
    "href": "docs-files.html#file-tokens",
    "description": "Browsers cannot attach an Authorization header to <img>, <video>, or <a download> requests. For protected files, exchange the normal Bearer token for a..."
  },
  {
    "title": "Files & Uploads",
    "section": "JavaScript example",
    "href": "docs-files.html#javascript-example",
    "description": "The admin dashboard performs this exchange automatically for file previews and download links."
  },
  {
    "title": "Files & Uploads",
    "section": "Storage configuration",
    "href": "docs-files.html#storage-configuration",
    "description": "New uploads go to the storage configured in Settings → File storage in the admin dashboard, or through the admin-only settings API."
  },
  {
    "title": "Files & Uploads",
    "section": "Local disk",
    "href": "docs-files.html#local-disk",
    "description": "basePath is relative to the server's working directory unless absolute. A leading $HOME is expanded at runtime. The directory must be writable by the..."
  },
  {
    "title": "Files & Uploads",
    "section": "S3-compatible storage",
    "href": "docs-files.html#s3-compatible-storage",
    "description": "Existing files are not migrated when the storage setting changes. Each file's _files row records its backend and container, so old files stay readable as..."
  },
  {
    "title": "Files & Uploads",
    "section": "Limits and caveats",
    "href": "docs-files.html#limits-and-caveats",
    "description": "Per-file size limits come from max_size on the column, in bytes."
  },
  {
    "title": "Files & Uploads",
    "section": "Troubleshooting",
    "href": "docs-files.html#troubleshooting",
    "description": ""
  },
  {
    "title": "Settings & Email",
    "section": "",
    "href": "docs-settings.html",
    "description": "Crabbase stores runtime configuration in a key/value settings table (_settings). You can manage all of it from the admin dashboard — no code, no curl, no restarts:"
  },
  {
    "title": "Settings & Email",
    "section": "Mail settings",
    "href": "docs-settings.html#mail-settings",
    "description": "TLS behavior: implicit TLS is used on port 465; otherwise STARTTLS. Once saved, password-reset emails work immediately — no restart needed."
  },
  {
    "title": "Settings & Email",
    "section": "App settings",
    "href": "docs-settings.html#app-settings",
    "description": "GET /api/settings/app returns 204 No Content if nothing has been saved yet."
  },
  {
    "title": "Settings & Email",
    "section": "Email templates",
    "href": "docs-settings.html#email-templates",
    "description": "Two templates are seeded by migrations and fully editable:"
  },
  {
    "title": "Settings & Email",
    "section": "Template variables",
    "href": "docs-settings.html#template-variables",
    "description": "Save via POST /api/settings/email-templates with the full EmailTemplates payload you got from the GET."
  }
];
