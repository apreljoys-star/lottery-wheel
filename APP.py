from flask import Flask, render_template, request, jsonify
import random
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

# Ensure these lists are defined outside the functions so they can be accessed
PARTICIPANTS = [
    "亞莉珊", "簡艾波", "卡莉兒", "克里斯", "艾而潔", "艾米莉",
    "易芙琳", "吉思爾", "艾芮希", "羅瑞妮", "簡米娜", "安利茲",
    "瑪莉蓮", "喬米爾", "羅納德", "艾爾文", "裴莎瑪", "梅西莎",
    "艾莉卡", "富迪碼", "法蒂瑪", "傑琦雅", "畢塔戈", "易傑克",
    "喬洛瑪", "朱莉娜", "詹瑞德", "卡瑞卓", "肯尼斯", "絮蕾蒂",
    "幸運爾", "馬爾克", "莫爾珍", "齊麥克", "那美", "賴瓦昇",
    "申瑞莎", "季凱揚", "史蒂芬", "莫妮卡", "林一帆", "欣倩",
    "王瑛芮", "李康", "艾芬琪"
]

PRIZES = ["大獎", "二獎", "三獎", "再來一次", "神秘禮物", "安慰獎"]

@app.route("/")
def index():
    # Send the list joined by newlines for the textarea
    options_text = "\n".join(PARTICIPANTS)
    return render_template('index.html', options=options_text)

@app.route("/spin", methods=["POST"])
def spin():
    # This receives the data from your '開始抽獎' button
    data = request.get_json()
    
    # Safety check: if no participants were sent, return an error
    options = data.get("options", [])
    if not options:
        return jsonify({"error": "請輸入抽獎者名單"}), 400
    
    # Pick the winners
    winner = random.choice(options)
    prize = random.choice(PRIZES)
    
    return jsonify({"winner": winner, "prize": prize})

if __name__ == "__main__":
    # Standard Render deployment settings
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
