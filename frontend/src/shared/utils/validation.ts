export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  const re = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
  return re.test(phone);
}
