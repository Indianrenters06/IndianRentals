const fs = require('fs');
let code = fs.readFileSync('admin/src/app/dashboard/page.js', 'utf8');
code = code.replace('} from "@phosphor-icons/react";', '} from "@phosphor-icons/react";\nimport { downloadPDFInvoice } from "@/utils/pdfInvoice";');
code = code.replace('avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(rental.user?.name || "G")}&background=random`', 'avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(rental.user?.name || "G")}&background=random`,\n    _raw: rental');
code = code.replace('<DropdownItem key="invoice" onPress={() => toast.success("Generating Invoice PDF...")}>Download Invoice</DropdownItem>', '<DropdownItem key="invoice" onPress={() => downloadPDFInvoice(item._raw)}>Download Invoice</DropdownItem>');
fs.writeFileSync('admin/src/app/dashboard/page.js', code);
