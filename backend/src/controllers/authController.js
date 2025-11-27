import bcrypt from 'bcrypt';
import Parent from '../models/Parent.js';
import Kid from '../models/Kid.js';
import generateToken2 from '../utils/generateToken.js';

export const signupParent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const exists = await Parent.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Parent already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const parent = await Parent.create({ name, email, password: hashed });
    const token = generateToken2({ id: parent._id, role: 'parent' });

    res.json({ token, role: 'parent', id: parent._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = parent email or kid username
    if (!identifier || !password)
      return res.status(400).json({ message: 'Missing credentials' });

    // Try Parent by email
    const parent = await Parent.findOne({ email: identifier });
    if (parent) {
      const match = await bcrypt.compare(password, parent.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = generateToken2({ id: parent._id, role: 'parent' });
      return res.json({ token, role: 'parent', id: parent._id });
    }

    // Try Kid by username
    const kid = await Kid.findOne({ username: identifier });
    if (kid) {
      const match2 = await bcrypt.compare(password, kid.password);
      if (!match2) return res.status(401).json({ message: 'Invalid credentials' });

      const token = generateToken2({ id: kid._id, role: 'kid' });
      return res.json({ token, role: 'kid', id: kid._id });
    }

    return res.status(404).json({ message: 'No user found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
