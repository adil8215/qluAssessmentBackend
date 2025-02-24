export interface User {
  id: string | number;
  name: string;
  hashed_password: string;
  contact_number: string;
  verified_flag: boolean;
  username: string;
  img_url?: string;
  email: string;
  other_info?: [];
}
