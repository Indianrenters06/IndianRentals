import { redirect } from 'next/navigation';

export default function CheckoutEntry() {
    redirect('/checkout/staged?new=1');
}
