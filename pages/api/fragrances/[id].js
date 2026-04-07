export default function handler(req, res) {
  // For now, return 404 since we don't have static fragrance data
  return res.status(404).json({ error: 'Fragrance not found' });
}