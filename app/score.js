// Deal scoring: one number per deal, best first.
// Score = discount share (0-70) + verdict bonus. True lows outrank routine sales
// even at a smaller discount, so the list a shopper sees first is the real bargains.

export const VERDICTS = {
  'true-low': { label: 'TRUE LOW', bonus: 25 },
  strong: { label: 'STRONG PRICE', bonus: 15 },
  routine: { label: 'ROUTINE SALE', bonus: 0 },
  'check-was': { label: 'CHECK THE WAS PRICE', bonus: -15 },
};

export function percentOff(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function verdictLabel(deal) {
  return VERDICTS[deal.verdict].label;
}

export function verdictClass(deal) {
  return deal.verdict;
}

export function dealScore(deal) {
  const discountShare = Math.min(70, Math.round(percentOff(deal) * 0.9));
  const bonus = VERDICTS[deal.verdict].bonus;
  return Math.max(1, Math.min(100, discountShare + bonus));
}

export function sortDeals(deals, sort) {
  const copy = [...deals];
  if (sort === 'discount') return copy.sort((a, b) => percentOff(b) - percentOff(a));
  if (sort === 'price-low') return copy.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') return copy.sort((a, b) => b.price - a.price);
  return copy.sort((a, b) => dealScore(b) - dealScore(a));
}
