import fragrances from '../../../data/fragrances';

export default function handler(req, res) {
  const { id } = req.query;
  const fragrance = fragrances.find(f => f.id === id);

  if (!fragrance) {
    return res.status(404).json({ error: 'Fragrance not found' });
  }

  res.status(200).json(fragrance);
}