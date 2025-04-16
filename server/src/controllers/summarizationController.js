const { HfInference } = require('@huggingface/inference');

const hf = new HfInference('YOUR_HUGGINGFACE_API_KEY'); // Replace with your Hugging Face API key

exports.summarizeText = async (req, res) => {
    const { text } = req.body;

    try {
        const summary = await hf.summarization({
            model: 'facebook/bart-large-cnn',
            inputs: text,
        });
        res.json(summary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to summarize text' });
    }
};