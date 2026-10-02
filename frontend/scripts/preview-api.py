"""Read-only sample API for visual inspection when local MongoDB is unavailable."""
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs

ROOT = Path(__file__).resolve().parents[2]
cms = json.loads((ROOT / 'frontend/cms_homepage_dump.json').read_text())
cms.update({
    'heroEnabled': True,
    'heroSlides': [
        {'title': 'The Tech That Powers Your Ambition. On Demand.', 'subtitle': 'Rent the devices you need, when you need them.', 'image': '/macbook-pro-new.jpg', 'ctaText': 'Explore Rentals', 'ctaLink': '/products'},
        {'title': '', 'subtitle': '', 'image': '/it-products-new.jpg', 'ctaLink': '/products'},
        {'title': '', 'subtitle': '', 'image': '/office-equipment-new.jpg', 'ctaLink': '/products'},
        {'title': '', 'subtitle': '', 'image': '/ipad-new.jpg', 'ctaLink': '/products'},
    ],
    'bestRentedProductIds': [], 'newLaunchProductIds': [],
})
images = ['/macbook-pro-new.jpg', '/ipad-new.jpg', '/mac-pro-new.jpg', '/it-products-new.jpg', '/office-equipment-new.jpg', '/images/macbook-pro.jpg']
names = ['MacBook Pro', 'iPad', 'Desktop Workstation', 'All In One Computer', 'Office Equipment', 'MacBook']
products = [dict(_id=str(i+1), name=name, slug=name.lower().replace(' ', '-'), category='IT Products', images=[images[i]], rentalPrice=2499 + i*700, rating=4.8, numReviews=12+i*4, stock=8, condition='New', discount='20% off') for i,name in enumerate(names)]
def child(name, i):
    return dict(_id='c'+str(i), name=name, slug=name.lower().replace(' ', '-'), image=images[i % len(images)])
categories = [
    dict(_id='p1', name='Apple', slug='apple', subcategories=[child('MacBook',0), child('iPad',1), child('iPhone',2)]),
    dict(_id='p2', name='Cameras', slug='dslr', subcategories=[child('DSLR',3), child('Camera',4)]),
    dict(_id='p3', name='IT Products', slug='it-products', subcategories=[child('All In One',5), child('Desktop',6)]),
    dict(_id='p4', name='Mobiles', slug='mobiles', subcategories=[child('SmartPhone',7)]),
]
class Handler(BaseHTTPRequestHandler):
    def send_json(self, body, status=200):
        data = json.dumps(body).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('X-Preview-Data', 'sample-read-only')
        self.end_headers()
        self.wfile.write(data)
    def do_OPTIONS(self):
        self.send_json({})
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if path == '/api/careers': return self.send_json(json.loads((ROOT / 'backend/config/careers-defaults.json').read_text()))
        if path == '/api/cms/homepage': return self.send_json(cms)
        if path.startswith('/api/cms/'): return self.send_json({'pageName': path.split('/')[-1]})
        if path in ('/api/categories','/api/categories/tree'): return self.send_json(categories)
        if path.endswith('/subcategories') and path.startswith('/api/categories/'):
            parent = path.split('/')[3]
            return self.send_json(next((c['subcategories'] for c in categories if c['_id']==parent), []))
        if path == '/api/products':
            limit = int(parse_qs(parsed.query).get('limit',[len(products)])[0])
            return self.send_json({'products':products[:limit], 'page':1, 'pages':1, 'total':len(products)})
        if path.startswith('/api/products/'):
            pid = path.rsplit('/',1)[-1]
            return self.send_json(next((p for p in products if p['_id']==pid), {}))
        if path == '/api/settings': return self.send_json({'siteName':'IndianRenters', 'siteLogo':'/logo-v2.png', 'theme':{'activeTheme':'default'}})
        if path == '/api/testimonials': return self.send_json([])
        return self.send_json({}, 404)
    def do_POST(self): self.send_json({'message':'Visual preview is read-only'}, 405)
    def do_PUT(self): self.send_json({'message':'Visual preview is read-only'}, 405)
    def do_PATCH(self): self.send_json({'message':'Visual preview is read-only'}, 405)
    def do_DELETE(self): self.send_json({'message':'Visual preview is read-only'}, 405)
    def log_message(self, fmt, *args):
        if not (self.path.startswith('/api/cms/') or self.path.startswith('/api/categories')):
            super().log_message(fmt, *args)
print('Read-only sample API at http://127.0.0.1:5001', flush=True)
ThreadingHTTPServer(('127.0.0.1',5001), Handler).serve_forever()
