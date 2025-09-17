import CrisisResource from '../models/CrisisResource.js';

export const getCrisisResources = async (req, res) => {
  try {
    const resources = await CrisisResource.find({ isActive: true })
      .sort({ country: 1, title: 1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCrisisResource = async (req, res) => {
  try {
    const { title, description, phoneNumber, websiteUrl, country } = req.body;

    const resource = new CrisisResource({
      title,
      description,
      phoneNumber,
      websiteUrl,
      country: country || 'US'
    });

    await resource.save();

    res.status(201).json({
      message: 'Crisis resource created successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCrisisResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, phoneNumber, websiteUrl, country, isActive } = req.body;

    const resource = await CrisisResource.findByIdAndUpdate(
      id,
      { title, description, phoneNumber, websiteUrl, country, isActive },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ error: 'Crisis resource not found' });
    }

    res.json({
      message: 'Crisis resource updated successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCrisisResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await CrisisResource.findByIdAndDelete(id);

    if (!resource) {
      return res.status(404).json({ error: 'Crisis resource not found' });
    }

    res.json({ message: 'Crisis resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
