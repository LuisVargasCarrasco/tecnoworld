from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

app = Flask(__name__)
CORS(app)  # Habilitar CORS

device = "cuda" if torch.cuda.is_available() else "cpu"

tokenizer = AutoTokenizer.from_pretrained("humarin/chatgpt_paraphraser_on_T5_base")
model = AutoModelForSeq2SeqLM.from_pretrained("humarin/chatgpt_paraphraser_on_T5_base").to(device)

def paraphrase(question, num_beams=5, num_beam_groups=5, num_return_sequences=5, repetition_penalty=10.0, diversity_penalty=3.0, no_repeat_ngram_size=2, temperature=0.7, max_length=128):
    input_ids = tokenizer(f'paraphrase: {question}', return_tensors="pt", padding="longest", max_length=max_length, truncation=True).input_ids.to(device)
    
    outputs = model.generate(input_ids, temperature=temperature, repetition_penalty=repetition_penalty, num_return_sequences=num_return_sequences, no_repeat_ngram_size=no_repeat_ngram_size, num_beams=num_beams, num_beam_groups=num_beam_groups, max_length=max_length, diversity_penalty=diversity_penalty)

    res = tokenizer.batch_decode(outputs, skip_special_tokens=True)
    return res

@app.route('/paraphrase', methods=['POST'])
def paraphrase_endpoint():
    data = request.json
    question = data.get("question", "")
    print(f"Received question: {question}")
    result = paraphrase(question)
    print(f"Generated paraphrases: {result}")
    return jsonify({"paraphrases": result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)