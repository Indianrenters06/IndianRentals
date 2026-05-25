const fs = require('fs');

const filesToUpdate = [
    'admin/src/app/dashboard/products/page.js',
    'admin/src/app/dashboard/customers/page.js',
    'admin/src/app/dashboard/orders/page.js',


    'admin/src/app/dashboard/coupons/active/page.js',
    'admin/src/app/dashboard/coupons/expired/page.js'
];

filesToUpdate.forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already processed
    if (content.includes('ConfirmDeleteModal')) return;

    // 1. Add import
    content = content.replace(
        "import toast from 'react-hot-toast';",
        "import toast from 'react-hot-toast';\nimport ConfirmDeleteModal from '@/components/ConfirmDeleteModal';"
    );

    // 2. Add state
    if (content.includes('const [loading, setLoading] = useState(')) {
        content = content.replace(
            /const \[loading, setLoading\] = useState\(.*?\);/,
            match => `${match}\n    const [confirmOpen, setConfirmOpen] = useState(false);\n    const [deleteTarget, setDeleteTarget] = useState(null);`
        );
    }

    // 3. Add Modal to JSX right after the main wrapper div
    // We look for a common root div pattern. This might be fragile.
    // Instead, let's insert it right before the Toast or Header.
    // In our admin pages, they often start with `<div className="w-full space-y-6 pb-12">`
    content = content.replace(
        /<div className="(w-full space-y-[^"]+ pb-12|flex flex-col[^"]+)">/,
        match => `${match}\n            <ConfirmDeleteModal\n                isOpen={confirmOpen}\n                onClose={() => setConfirmOpen(false)}\n                onConfirm={() => { setConfirmOpen(false); if(deleteTarget) handleDelete(deleteTarget.id); }}\n                title="Confirm Action"\n                description="Are you sure you want to perform this destructive action? This cannot be undone."\n                loading={false}\n            />\n`
    );

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
});
