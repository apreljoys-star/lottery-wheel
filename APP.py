from flask import Flask, render_template, request, jsonify
import random
import os

app = Flask(__name__)

# List of prizes for the spin function
PRIZES = ["大獎", "二獎", "三獎", "神秘禮物", "精美文具", "安慰獎"]

@app.route("/")
def index():
    participants = [
        "亞莉珊", "簡艾波", "卡莉兒", "克里斯", "艾而潔", "艾米莉",
        "易芙琳", "吉思爾", "艾芮希", "羅瑞妮", "簡米娜", "安利茲",
        "瑪莉蓮", "喬米爾", "羅納德", "艾爾文", "裴莎瑪", "梅西莎",
        "艾莉卡", "富迪碼", "法蒂瑪", "傑琦雅", "畢塔戈", "易傑克",
        "喬洛瑪", "朱莉娜", "詹瑞德", "卡瑞卓", "肯尼斯", "絮蕾蒂",
        "幸運爾", "馬爾克", "莫爾珍", "齊麥克", "那美", "賴瓦昇",
        "申瑞莎", "季凱揚", "史蒂芬", "莫妮卡", "林一帆", "欣倩",
        "王瑛芮", "李康", "艾芬琪"
    ]
    options_text = "\n".join(participants)
    return render_template('index.html', options=options_text)

@app.route("/spin", methods=["POST"])
def spin():
    try:
        data = request.get_json()
        # If no data or empty list sent, provide a fallback
        participants = data.get("options", [])
        
        if not participants:
            return jsonify({"winner": "無人抽獎", "prize": "無"}), 200

        winner = random.choice(participants)
        prize = random.choice(PRIZES)
        
        return jsonify({"winner": winner, "prize": prize})
    except Exception as e:
        # This will print the exact error to your Render Logs
        print(f"DEBUG ERROR: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
