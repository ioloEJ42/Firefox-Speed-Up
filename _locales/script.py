import os
import json

# Define the messages for each language
messages = {
    "zh": {
        "appName": {
            "message": "视频速度控制器",
            "description": "扩展的名称"
        },
        "appDesc": {
            "message": "控制HTML5视频和音频播放速度，并提供额外功能",
            "description": "扩展的描述"
        },
        "speedPresetsTitle": {
            "message": "速度预设",
            "description": "速度预设部分的标题"
        },
        "speedControlTitle": {
            "message": "精细速度控制",
            "description": "速度控制滑块部分的标题"
        },
        "skipIntervalTitle": {
            "message": "跳过间隔",
            "description": "跳过间隔部分的标题"
        },
        "keyboardShortcutsTitle": {
            "message": "键盘快捷键",
            "description": "键盘快捷键部分的标题"
        },
        "Speed_up": {
            "message": "加快播放",
            "description": "加速命令的描述"
        },
        "Speed_down": {
            "message": "减慢播放",
            "description": "减速命令的描述"
        }
    },
    "ar": {
        "appName": {
            "message": "متحكم سرعة الفيديو",
            "description": "اسم الإضافة"
        },
        "appDesc": {
            "message": "التحكم في سرعة تشغيل فيديو وصوت HTML5 مع ميزات إضافية",
            "description": "وصف الإضافة"
        },
        "speedPresetsTitle": {
            "message": "إعدادات السرعة المسبقة",
            "description": "عنوان قسم إعدادات السرعة المسبقة"
        },
        "speedControlTitle": {
            "message": "التحكم الدقيق في السرعة",
            "description": "عنوان قسم شريط التحكم في السرعة"
        },
        "skipIntervalTitle": {
            "message": "فترة التخطي",
            "description": "عنوان قسم فترة التخطي"
        },
        "keyboardShortcutsTitle": {
            "message": "اختصارات لوحة المفاتيح",
            "description": "عنوان قسم اختصارات لوحة المفاتيح"
        },
        "Speed_up": {
            "message": "زيادة سرعة التشغيل",
            "description": "وصف أمر زيادة السرعة"
        },
        "Speed_down": {
            "message": "إبطاء التشغيل",
            "description": "وصف أمر تقليل السرعة"
        }
    },
    "hi": {
        "appName": {
            "message": "वीडियो गति नियंत्रक",
            "description": "एक्सटेंशन का नाम"
        },
        "appDesc": {
            "message": "अतिरिक्त सुविधाओं के साथ HTML5 वीडियो और ऑडियो प्लेबैक गति नियंत्रित करें",
            "description": "एक्सटेंशन का विवरण"
        },
        "speedPresetsTitle": {
            "message": "गति प्रीसेट",
            "description": "गति प्रीसेट खंड का शीर्षक"
        },
        "speedControlTitle": {
            "message": "सूक्ष्म गति नियंत्रण",
            "description": "गति नियंत्रण स्लाइडर खंड का शीर्षक"
        },
        "skipIntervalTitle": {
            "message": "अंतराल छोड़ें",
            "description": "अंतराल छोड़ने के खंड का शीर्षक"
        },
        "keyboardShortcutsTitle": {
            "message": "कीबोर्ड शॉर्टकट",
            "description": "कीबोर्ड शॉर्टकट खंड का शीर्षक"
        },
        "Speed_up": {
            "message": "प्लेबैक गति बढ़ाएँ",
            "description": "गति बढ़ाने के कमांड का विवरण"
        },
        "Speed_down": {
            "message": "प्लेबैक गति कम करें",
            "description": "गति कम करने के कमांड का विवरण"
        }
    }
}

# Create directories and files
base_dir = "_locales"
os.makedirs(base_dir, exist_ok=True)

for lang, lang_messages in messages.items():
    lang_dir = os.path.join(base_dir, lang)
    os.makedirs(lang_dir, exist_ok=True)
    
    messages_file = os.path.join(lang_dir, "messages.json")
    
    with open(messages_file, "w", encoding="utf-8") as f:
        json.dump(lang_messages, f, ensure_ascii=False, indent=2)

print(f"Added the following languages: {', '.join(messages.keys())}")
print("Folders and messages.json files have been created successfully with translations.")