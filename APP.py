from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# The list of people
PARTICIPANTS = [
    "亞莉珊", "簡艾波", "卡莉兒", "克里斯", "艾而潔", "艾米莉", 
    "易芙琳", "吉思爾", "艾芮希", "羅琮妮", "簡米娜", "安利茲", 
    "瑪莉蓮", "商米爾", "羅納德", "艾爾文", "裘莎瑪", "梅西莎", 
    "艾莉卡", "富迪鎷", "法蒂瑪", "傑琦雅", "畢塔戈", "易傑克", 
    "喬洛瑪", "朱莉娜", "詹瑞德", "卡珊卓", "肯尼斯", "絜蕾蒂", 
    "幸運爾", "馬爾克", "莫爾珍", "齊麥克", "那芙", "賴瓦昇", 
    "申瑞莎", "李凱揚", "史蒂芬", "莫妮卡", "林一帆", "欣倩", 
    "王瑛芮", "李康", "艾芬琪"
]

# The list of potential prizes
PRIZES = ["大獎", "二獎", "三獎", "再來一次", "神秘禮物", "安慰獎"]

@app.route("/")
def index():
    return render_template("INDEX.html", options=PARTICIPANTS)

@app.route("/spin", methods=["POST"])
def spin():
    data = request.get_json()
    options = data.get("options", []) # These are the participants from the textbox

    if not options:
        return jsonify({"error": "請至少輸入一個選項"}), 400

    # 1. Pick a winning Participant
    winner_index = random.randint(0, len(options) - 1)
    winner_name = options[winner_index]

    # 2. Pick a random Prize
    winning_prize = random.choice(PRIZES)

    return jsonify({
        "winner_index": winner_index,
        "winner_text": winner_name,
        "prize": winning_prize  # Send the prize back too!
    })

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)