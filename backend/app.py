from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

app = Flask(__name__)
CORS(app)

# Initialize model and tokenizer
def load_model():
    try:
        # Use the original model path from your fine-tuning script
        model_path = "meta-llama/Meta-Llama-3-70B-Instruct"
        access_token = "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"
        
        # Load the model with the same quantization config used during training
        model = AutoModelForCausalLM.from_pretrained(
            model_path,
            device_map="auto",
            torch_dtype=torch.float16,
            load_in_4bit=True,
            use_auth_token=access_token
        )
        
        tokenizer = AutoTokenizer.from_pretrained(model_path, use_auth_token=access_token)
        return model, tokenizer
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return None, None

model, tokenizer = load_model()

@app.route('/')
def home():
    return jsonify({"status": "API is running"})

@app.route('/api/chat', methods=['POST'])
def chat():
    if model is None or tokenizer is None:
        return jsonify({
            'error': 'Model not loaded properly',
            'status': 'error'
        }), 500

    try:
        data = request.json
        user_input = data.get('message', '')
        
        # Prepare the input
        inputs = tokenizer(f"User: {user_input}\nAssistant:", return_tensors="pt")
        inputs = {k: v.to(model.device) for k, v in inputs.items()}
        
        # Generate response
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_length=512,
                num_return_sequences=1,
                temperature=0.7,
                top_p=0.95,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = response.split("Assistant:")[-1].strip()
        
        return jsonify({
            'response': response,
            'status': 'success'
        })
    
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 