export type Donation = {
  id: string;
  email: string;
  name: string;
  amount_donated: number;
  created_at: string;
};

export type DonationInsert = Omit<Donation, "id" | "created_at">;
