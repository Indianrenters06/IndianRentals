const { test } = require('node:test');
const assert = require('node:assert/strict');
const User = require('../models/User');
const { getAddresses, addAddress, updateAddress } = require('../controllers/userController');
const { getAllUsers } = require('../controllers/adminController');

function invoke(handler, req) {
    return new Promise((resolve, reject) => {
        const res = {
            statusCode: 200,
            status(code) { this.statusCode = code; return this; },
            json(body) { resolve({ status: this.statusCode, body }); },
        };
        handler(req, res, error => reject(error));
    });
}

test('a customer address is saved on that user, returned to them, and visible in admin customers', async t => {
    const first = new User({ name: 'First Customer', email: 'first@example.com', authProvider: 'google' });
    const second = new User({ name: 'Second Customer', email: 'second@example.com', authProvider: 'google' });
    const users = new Map([[String(first._id), first], [String(second._id), second]]);
    for (const user of users.values()) user.save = async () => user;

    t.mock.method(User, 'findById', id => {
        const user = users.get(String(id));
        return {
            select: async () => user,
            then: resolve => resolve(user),
        };
    });
    t.mock.method(User, 'find', () => ({
        select() { return this; },
        sort: async () => [...users.values()],
    }));

    const address = {
        name: 'First Customer', addressLine: '12 Example Road', city: 'Delhi', state: 'Delhi',
        pincode: '110001', country: 'India', phone: '9999999999', isBillingSame: true,
    };
    const saved = await invoke(addAddress, { user: { _id: first._id }, body: { ...address, role: 'admin' } });
    assert.equal(saved.status, 201);
    assert.equal(first.addresses.length, 1);
    assert.equal(first.addresses[0].city, 'Delhi');
    assert.equal(first.addresses[0].isDefault, true);
    assert.equal(first.addresses[0].role, undefined);
    assert.equal(second.addresses.length, 0);

    await invoke(addAddress, { user: { _id: first._id }, body: { ...address, addressLine: '34 Second Road' } });
    const selectedId = first.addresses[1]._id;
    await invoke(updateAddress, {
        user: { _id: first._id },
        params: { addressId: String(selectedId) },
        body: { isDefault: true },
    });
    assert.equal(first.addresses[0].isDefault, false);
    assert.equal(first.addresses[1].isDefault, true);

    const own = await invoke(getAddresses, { user: { _id: first._id } });
    assert.equal(own.body[0].addressLine, address.addressLine);
    assert.equal(own.body[1].isDefault, true);
    const other = await invoke(getAddresses, { user: { _id: second._id } });
    assert.equal(other.body.length, 0);

    const admin = await invoke(getAllUsers, {});
    assert.equal(admin.body.find(user => user._id.equals(first._id)).addresses[0].pincode, address.pincode);
});
