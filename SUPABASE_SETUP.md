# Supabase Setup Instructions for Memory Weaver

## Storage Setup (Required for Photo Upload)

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/project/lpqvnthejbrmwqyjiskn

2. **Navigate to Storage**:
   - Click "Storage" in the left sidebar
   - Click "Create a new bucket"

3. **Create Photos Bucket**:
   - Bucket name: `photos`
   - Make it public: ✅ (check this box)
   - Click "Create bucket"

4. **Set Bucket Policies** (Optional but recommended):
   - Click on the `photos` bucket
   - Go to "Configuration" tab
   - Set up Row Level Security (RLS) policies if desired

## Test the App

1. **Visit**: http://localhost:5174/
2. **Sign Up**: Create a new account
3. **Upload Photos**: Click "Upload Photo" to test storage

## Next Steps

Once storage is set up, your Memory Weaver app will have:
- ✅ User Authentication
- ✅ Photo Upload & Storage
- ✅ Beautiful Dark Theme UI
- ✅ Responsive Design

## Troubleshooting

If you get storage errors:
1. Make sure the `photos` bucket exists
2. Ensure it's set to public
3. Check the browser console for detailed error messages