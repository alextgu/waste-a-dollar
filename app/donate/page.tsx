// app/donate/page.tsx
import { createCheckoutSession } from '../actions/stripe';

export default function DonatePage() {
  return (
    <div className="max-w-sm mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Support My Work</h1>
      
      <form action={createCheckoutSession} className="space-y-4">
        <div className="flex items-center border rounded-md p-2">
          <span className="mr-2 text-gray-500">$</span>
          <input 
            name="amount" 
            type="number" 
            step="0.01" 
            min="1.00" 
            defaultValue="5.00"
            className="w-full outline-none"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-[#635bff] text-white py-3 rounded-lg font-semibold hover:bg-[#5851ea] transition-colors"
        >
          Donate with Stripe
        </button>
      </form>
      
      <p className="text-xs text-gray-400 mt-4">
        Securely processed by Stripe. 
      </p>
    </div>
  );
}