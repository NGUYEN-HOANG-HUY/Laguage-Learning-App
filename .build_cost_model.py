from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.table import Table, TableStyleInfo


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "07_cost_model.xlsx"
ACCESS_DATE = "23/11/2026"

prices = [
    ("Google STT V2 Standard", 0.016, "USD/audio minute", "https://cloud.google.com/speech-to-text/pricing", "0.016 USD/min; pay-as-you-go standard tier"),
    ("Google TTS Standard", 4, "USD/1M characters", "https://cloud.google.com/text-to-speech/pricing", "4 USD/1M chars after account free tier; model excludes free tier"),
    ("Google TTS Chirp 3 HD", 30, "USD/1M characters", "https://cloud.google.com/text-to-speech/pricing", "30 USD/1M chars; 1M characters free tier omitted in conservative list-price model"),
    ("ElevenLabs TTS v4", 80, "USD/1M characters", "https://elevenlabs.io/pricing/api", "0.08 USD/1K characters; converted to 80 USD/1M"),
    ("OpenAI GPT-5 nano input", 0.05, "USD/1M tokens", "https://developers.openai.com/api/docs/pricing", "Standard input price"),
    ("OpenAI GPT-5 nano output", 0.40, "USD/1M tokens", "https://developers.openai.com/api/docs/pricing", "Standard output price"),
    ("OpenAI GPT-5 mini input", 0.25, "USD/1M tokens", "https://developers.openai.com/api/docs/pricing", "Standard input price"),
    ("OpenAI GPT-5 mini output", 2.00, "USD/1M tokens", "https://developers.openai.com/api/docs/pricing", "Standard output price"),
    ("OpenAI GPT-5.4 mini input", 0.75, "USD/1M tokens", "https://developers.openai.com/api/docs/pricing", "Standard input price"),
    ("OpenAI GPT-5.4 mini output", 4.50, "USD/1M tokens", "https://developers.openai.com/api/docs/pricing", "Standard output price"),
    ("OpenAI Realtime-2.1 audio input", 32, "USD/1M audio tokens", "https://developers.openai.com/api/docs/models/gpt-realtime-2.1", "Standard audio input"),
    ("OpenAI Realtime-2.1 audio output", 64, "USD/1M audio tokens", "https://developers.openai.com/api/docs/models/gpt-realtime-2.1", "Standard audio output"),
    ("OpenAI Realtime-2.1 text input", 4, "USD/1M text tokens", "https://developers.openai.com/api/docs/models/gpt-realtime-2.1", "Standard text input"),
    ("OpenAI Realtime-2.1 text output", 24, "USD/1M text tokens", "https://developers.openai.com/api/docs/models/gpt-realtime-2.1", "Standard text output"),
    ("OpenAI Realtime-2.1-mini audio input", 10, "USD/1M audio tokens", "https://developers.openai.com/api/docs/pricing", "Standard audio input"),
    ("OpenAI Realtime-2.1-mini audio output", 20, "USD/1M audio tokens", "https://developers.openai.com/api/docs/pricing", "Standard audio output"),
    ("OpenAI Realtime-2.1-mini text input", 0.60, "USD/1M text tokens", "https://developers.openai.com/api/docs/pricing", "Standard text input"),
    ("OpenAI Realtime-2.1-mini text output", 2.40, "USD/1M text tokens", "https://developers.openai.com/api/docs/pricing", "Standard text output"),
    ("Deepgram Voice Agent Standard", 0.075, "USD/connection minute", "https://deepgram.com/pricing", "Bundled STT + managed LLM + TTS; comparator, not equivalent to native speech-to-speech"),
]

wb = Workbook()
ws = wb.active
ws.title = "Huong dan"
guide_rows = [
    ["D6 — Mô hình chi phí (USD, bản nháp)", "Ghi chú"],
    ["Ngày kiểm tra giá", ACCESS_DATE],
    ["Phạm vi", "Ước tính provider usage; chưa gồm thuế, hosting, DB, observability, payment fees, support, retry ngoài giả định hoặc FX."],
    ["Chính sách giá", "Đơn giá ở Inputs có URL và ngày. Cần xác minh lại trước khi ký hợp đồng/triển khai."],
    ["Giả định usage", "Sessions, phút nói, turns, tokens và chars là [GIẢ ĐỊNH] để minh họa công thức; thay bằng telemetry sau pilot."],
    ["Native Realtime", "OpenAI Realtime tính theo token. Tokens/audio minute chưa được xác minh; để trống Inputs!B39:B42, kết quả realtime/hybrid sẽ ghi CHƯA XÁC MINH cho tới khi điền số đo."],
    ["Voice agent comparator", "Deepgram Voice Agent Standard bao gồm STT + managed LLM + TTS theo connection minute. Đây là comparator được báo giá theo phút, không đồng nhất với native speech-to-speech."],
    ["Free tier", "Không trừ free tier khỏi unit costs; tránh đánh giá thấp chi phí mở rộng. Google Standard/Chirp miễn phí có hạn mức theo tài khoản/tháng."],
    ["ARPU / conversion / fixed cost", "Inputs!B50:B52 để trống đến khi được duyệt/đo. Revenue, margin và break-even sẽ hiện CHƯA XÁC MINH, không tự gán giá."],
    ["Scale", "100 / 1.000 / 10.000 MAU là stress scenarios theo MASTER_PROMPT, không phải dự báo người dùng."],
    ["Đọc workbook", "Inputs: đơn giá + biến chỉnh được. Unit cost: chi phí / lượt (bình quân) / phiên / MAU. Scale: 3 quy mô và unit economics. Sensitivity: hệ số API và conversion."],
    ["Caveat", "Không dùng con số trong workbook làm báo giá hoặc dự đoán kết quả học. Không có giá Azure PAYG cố định trong trang được đọc nên không đưa vào phép tính."],
]
for row in guide_rows:
    ws.append(row)

inputs = wb.create_sheet("Inputs")
inputs.append(["Tham số", "Giá trị", "Đơn vị", "Loại", "Nguồn / ghi chú"])
input_rows = {}
for name, value, unit, url, note in prices:
    inputs.append([name, value, unit, "ĐÃ XÁC MINH", f"{note}; {url}; truy cập {ACCESS_DATE}"])
    input_rows[name] = inputs.max_row

assumption_data = [
    ("Eco sessions per MAU per month", 6, "sessions/month", "GIẢ ĐỊNH", "Scenario input; replace with pilot telemetry"),
    ("Eco voice minutes per session", 1, "minutes/session", "GIẢ ĐỊNH", "Scenario input"),
    ("Eco LLM turns per session", 5, "turns/session", "GIẢ ĐỊNH", "Scenario input"),
    ("Eco LLM input tokens per turn", 120, "tokens/turn", "GIẢ ĐỊNH", "Scenario input"),
    ("Eco LLM output tokens per turn", 50, "tokens/turn", "GIẢ ĐỊNH", "Scenario input"),
    ("Eco TTS chars per turn", 250, "characters/turn", "GIẢ ĐỊNH", "Scenario input"),
    ("Balanced sessions per MAU per month", 12, "sessions/month", "GIẢ ĐỊNH", "Scenario input"),
    ("Balanced voice minutes per session", 3, "minutes/session", "GIẢ ĐỊNH", "Scenario input"),
    ("Balanced LLM turns per session", 8, "turns/session", "GIẢ ĐỊNH", "Scenario input"),
    ("Balanced LLM input tokens per turn", 350, "tokens/turn", "GIẢ ĐỊNH", "Scenario input"),
    ("Balanced LLM output tokens per turn", 120, "tokens/turn", "GIẢ ĐỊNH", "Scenario input"),
    ("Balanced TTS chars per turn", 700, "characters/turn", "GIẢ ĐỊNH", "Scenario input"),
    ("Premium sessions per MAU per month", 20, "sessions/month", "GIẢ ĐỊNH", "Scenario input"),
    ("Premium voice minutes per session", 5, "minutes/session", "GIẢ ĐỊNH", "Scenario input"),
    ("Premium LLM turns per session", 12, "turns/session", "GIẢ ĐỊNH", "Scenario input"),
    ("Premium LLM input tokens per turn", 700, "tokens/turn", "GIẢ ĐỊNH", "Scenario input"),
    ("Premium LLM output tokens per turn", 250, "tokens/turn", "GIẢ ĐỊNH", "Scenario input"),
    ("Premium TTS chars per turn", 1500, "characters/turn", "GIẢ ĐỊNH", "Scenario input"),
    ("Realtime input audio tokens per voice minute", None, "tokens/minute", "CHƯA XÁC MINH", "Must be measured for selected realtime model"),
    ("Realtime output audio tokens per voice minute", None, "tokens/minute", "CHƯA XÁC MINH", "Must be measured for selected realtime model"),
    ("Realtime input text tokens per voice minute", None, "tokens/minute", "CHƯA XÁC MINH", "Must be measured for selected realtime model"),
    ("Realtime output text tokens per voice minute", None, "tokens/minute", "CHƯA XÁC MINH", "Must be measured for selected realtime model"),
    ("Realtime share in hybrid", 0.5, "fraction", "GIẢ ĐỊNH", "Placeholder mix of realtime and balanced cascade"),
    ("ARPU per paid subscriber per month", None, "USD/month", "CHƯA XÁC MINH", "Do not fill until pricing/WTP is reviewed"),
    ("Paid conversion of MAU", None, "fraction", "CHƯA XÁC MINH", "Editable after pilot; not a market estimate"),
    ("Fixed monthly operating cost", None, "USD/month", "CHƯA XÁC MINH", "Enter only after operating budget is approved"),
]
assumption_rows = {}
for row in assumption_data:
    inputs.append(list(row))
    assumption_rows[row[0]] = inputs.max_row

unit = wb.create_sheet("Unit cost")
unit.append([
    "Tier", "Sessions / MAU / month", "Voice min / session", "LLM turns / session",
    "Input tokens / turn", "Output tokens / turn", "TTS chars / turn", "Pipeline",
    "USD / session", "USD / MAU / month", "Formula status", "USD / turn (average)",
])

tiers = [
    ("Economy", "Eco", "GPT-5 nano", 2, 3, 6, 7),
    ("Balanced", "Balanced", "GPT-5 mini", 2, 4, 8, 9),
    ("Premium", "Premium", "GPT-5.4 mini", 2, 5, 10, 11),
]
input_key_row = {name: row for name, row in input_rows.items()}
assumption_key_row = {name: row for name, row in assumption_rows.items()}
unit_rows = {}
for tier, prefix, llm, asr_price_row, tts_price_row, llm_in_row, llm_out_row in tiers:
    assumptions = [
        assumption_key_row[f"{prefix} sessions per MAU per month"],
        assumption_key_row[f"{prefix} voice minutes per session"],
        assumption_key_row[f"{prefix} LLM turns per session"],
        assumption_key_row[f"{prefix} LLM input tokens per turn"],
        assumption_key_row[f"{prefix} LLM output tokens per turn"],
        assumption_key_row[f"{prefix} TTS chars per turn"],
    ]
    input_cells = [f"Inputs!$B${r}" for r in assumptions]
    unit.append([tier, f"={input_cells[0]}", f"={input_cells[1]}", f"={input_cells[2]}", f"={input_cells[3]}", f"={input_cells[4]}", f"={input_cells[5]}", "Cascade"])
    row_num = unit.max_row
    asr_rate = f"Inputs!$B${asr_price_row}"
    tts_rate = f"Inputs!$B${tts_price_row}"
    llm_in = f"Inputs!$B${llm_in_row}"
    llm_out = f"Inputs!$B${llm_out_row}"
    unit.cell(row_num, 9, f"=C{row_num}*{asr_rate}+D{row_num}*(E{row_num}*{llm_in}+F{row_num}*{llm_out})/1000000+D{row_num}*G{row_num}*{tts_rate}/1000000")
    unit.cell(row_num, 10, f"=B{row_num}*I{row_num}")
    unit.cell(row_num, 11, "Đơn giá usage; chưa gồm overhead")
    unit.cell(row_num, 12, f'=IF(OR(NOT(ISNUMBER(I{row_num})),D{row_num}<=0),"CHƯA XÁC MINH",I{row_num}/D{row_num})')
    unit_rows[(tier, "Cascade")] = row_num

    realtime_price_rows = (16, 17, 18, 19) if tier != "Premium" else (12, 13, 14, 15)
    unit.append([tier, f"={input_cells[0]}", f"={input_cells[1]}", f"={input_cells[2]}", f"={input_cells[3]}", f"={input_cells[4]}", f"={input_cells[5]}", "Native Realtime"])
    row_num = unit.max_row
    token_rows = [assumption_key_row[f"Realtime {label} tokens per voice minute"] for label in [
        "input audio", "output audio", "input text", "output text"
    ]]
    missing_guard = ",".join(f"Inputs!$B${r}" for r in token_rows)
    realtime_cost = (
        f"=IF(COUNT({missing_guard})<4,\"CHƯA XÁC MINH\","
        f"C{row_num}*(Inputs!$B${token_rows[0]}*Inputs!$B${realtime_price_rows[0]}"
        f"+Inputs!$B${token_rows[1]}*Inputs!$B${realtime_price_rows[1]}"
        f"+Inputs!$B${token_rows[2]}*Inputs!$B${realtime_price_rows[2]}"
        f"+Inputs!$B${token_rows[3]}*Inputs!$B${realtime_price_rows[3]})/1000000)"
    )
    unit.cell(row_num, 9, realtime_cost)
    unit.cell(row_num, 10, f'=IF(ISNUMBER(I{row_num}),B{row_num}*I{row_num},"CHƯA XÁC MINH")')
    unit.cell(row_num, 11, "Native realtime; cần token/min đo thực tế")
    unit.cell(row_num, 12, f'=IF(OR(NOT(ISNUMBER(I{row_num})),D{row_num}<=0),"CHƯA XÁC MINH",I{row_num}/D{row_num})')
    unit_rows[(tier, "Native Realtime")] = row_num

    unit.append([tier, f"={input_cells[0]}", f"={input_cells[1]}", f"={input_cells[2]}", f"={input_cells[3]}", f"={input_cells[4]}", f"={input_cells[5]}", "Hybrid"])
    row_num = unit.max_row
    cascade_row = unit_rows[(tier, "Cascade")]
    hybrid_formula = (
        f'=IF(ISNUMBER(I{unit_rows[(tier, "Native Realtime")]}),'
        f'Inputs!$B${assumption_key_row["Realtime share in hybrid"]}*I{unit_rows[(tier, "Native Realtime")]}'
        f'+(1-Inputs!$B${assumption_key_row["Realtime share in hybrid"]})*I{cascade_row},'
        f'"CHƯA XÁC MINH")'
    )
    unit.cell(row_num, 9, hybrid_formula)
    unit.cell(row_num, 10, f'=IF(ISNUMBER(I{row_num}),B{row_num}*I{row_num},"CHƯA XÁC MINH")')
    unit.cell(row_num, 11, "Mix ratio là giả định, chỉnh trong Inputs")
    unit.cell(row_num, 12, f'=IF(OR(NOT(ISNUMBER(I{row_num})),D{row_num}<=0),"CHƯA XÁC MINH",I{row_num}/D{row_num})')
    unit_rows[(tier, "Hybrid")] = row_num

    unit.append([tier, f"={input_cells[0]}", f"={input_cells[1]}", f"={input_cells[2]}", f"={input_cells[3]}", f"={input_cells[4]}", f"={input_cells[5]}", "Voice Agent bundle proxy"])
    row_num = unit.max_row
    deepgram_rate_row = input_key_row["Deepgram Voice Agent Standard"]
    unit.cell(row_num, 9, f"=C{row_num}*Inputs!$B${deepgram_rate_row}")
    unit.cell(row_num, 10, f"=B{row_num}*I{row_num}")
    unit.cell(row_num, 11, "Bundle comparator; không đồng nhất native S2S")
    unit.cell(row_num, 12, f'=IF(OR(NOT(ISNUMBER(I{row_num})),D{row_num}<=0),"CHƯA XÁC MINH",I{row_num}/D{row_num})')
    unit_rows[(tier, "Voice Agent bundle proxy")] = row_num

scale = wb.create_sheet("Scale")
scale.append([
    "MAU scenario", "Tier", "Pipeline", "USD / MAU / month",
    "Total AI spend / month (USD)", "Revenue / month (USD)",
    "Net after AI + fixed cost (USD)", "Break-even MAU",
])
scale_sizes = [100, 1000, 10000]
for mau in scale_sizes:
    for tier, _, _, _, _, _, _ in tiers:
        for pipeline in ["Cascade", "Native Realtime", "Hybrid", "Voice Agent bundle proxy"]:
            scale.append([mau, tier, pipeline])
            row_num = scale.max_row
            ref = unit_rows[(tier, pipeline)]
            scale.cell(row_num, 4, f"='Unit cost'!J{ref}")
            scale.cell(row_num, 5, f'=IF(ISNUMBER(D{row_num}),A{row_num}*D{row_num},"CHƯA XÁC MINH")')
            arpu_row = assumption_key_row["ARPU per paid subscriber per month"]
            conversion_row = assumption_key_row["Paid conversion of MAU"]
            fixed_row = assumption_key_row["Fixed monthly operating cost"]
            scale.cell(row_num, 6, f'=IF(OR(Inputs!$B${arpu_row}="",Inputs!$B${conversion_row}=""),"CHƯA XÁC MINH",A{row_num}*Inputs!$B${arpu_row}*Inputs!$B${conversion_row})')
            scale.cell(row_num, 7, f'=IF(OR(NOT(ISNUMBER(E{row_num})),Inputs!$B${arpu_row}="",Inputs!$B${conversion_row}="",Inputs!$B${fixed_row}=""),"CHƯA XÁC MINH",F{row_num}-E{row_num}-Inputs!$B${fixed_row})')
            scale.cell(row_num, 8, f'=IF(OR(NOT(ISNUMBER(D{row_num})),Inputs!$B${arpu_row}="",Inputs!$B${conversion_row}="",Inputs!$B${fixed_row}=""),"CHƯA XÁC MINH",IF(Inputs!$B${arpu_row}*Inputs!$B${conversion_row}-D{row_num}<=0,"KHÔNG HÒA VỐN",Inputs!$B${fixed_row}/(Inputs!$B${arpu_row}*Inputs!$B${conversion_row}-D{row_num})))')

sensitivity = wb.create_sheet("Sensitivity")
sensitivity.append(["Sensitivity: API cost factor", "Balanced cascade USD/MAU/month", "100 MAU", "1,000 MAU", "10,000 MAU"])
balanced_cascade_row = unit_rows[("Balanced", "Cascade")]
for factor in [0.5, 1, 2]:
    sensitivity.append([factor, f"='Unit cost'!J{balanced_cascade_row}*A{sensitivity.max_row + 1}"])
    r = sensitivity.max_row
    sensitivity.cell(r, 3, f'=IF(ISNUMBER(B{r}),B{r}*100,"CHƯA XÁC MINH")')
    sensitivity.cell(r, 4, f'=IF(ISNUMBER(B{r}),B{r}*1000,"CHƯA XÁC MINH")')
    sensitivity.cell(r, 5, f'=IF(ISNUMBER(B{r}),B{r}*10000,"CHƯA XÁC MINH")')

sensitivity["G1"] = "Sensitivity: paid conversion (multiplier of approved base input)"
sensitivity["H1"] = "Conversion input"
sensitivity["I1"] = "Paid users at 1,000 MAU"
sensitivity["J1"] = "Revenue at 1,000 MAU (USD)"
sensitivity["K1"] = "Revenue minus balanced cascade AI (USD)"
conversion_row = assumption_key_row["Paid conversion of MAU"]
arpu_row = assumption_key_row["ARPU per paid subscriber per month"]
for index, multiplier in enumerate([0.5, 1, 1.5], start=2):
    sensitivity.cell(index, 7, multiplier)
    sensitivity.cell(index, 8, f'=IF(Inputs!$B${conversion_row}="","CHƯA XÁC MINH",Inputs!$B${conversion_row}*G{index})')
    sensitivity.cell(index, 9, f'=IF(ISNUMBER(H{index}),1000*H{index},"CHƯA XÁC MINH")')
    sensitivity.cell(index, 10, f'=IF(OR(NOT(ISNUMBER(H{index})),Inputs!$B${arpu_row}=""),"CHƯA XÁC MINH",1000*H{index}*Inputs!$B${arpu_row})')
    sensitivity.cell(index, 11, f'=IF(OR(NOT(ISNUMBER(J{index})),NOT(ISNUMBER(\'Unit cost\'!J{balanced_cascade_row}))),"CHƯA XÁC MINH",J{index}-1000*\'Unit cost\'!J{balanced_cascade_row})')

sources = wb.create_sheet("Nguon")
sources.append(["Provider / model", "Đơn giá đầu vào", "Đơn vị", "URL", "Ngày truy cập", "Ghi chú"])
for name, value, unit_name, url, note in prices:
    sources.append([name, value, unit_name, url, ACCESS_DATE, note])
sources.append(["Azure Speech PAYG", "CHƯA XÁC MINH", "region/service dependent", "https://azure.microsoft.com/en-us/pricing/details/speech/", ACCESS_DATE, "Trang truy cập nêu free tier và giá thay đổi theo region/offer; không đưa vào phép tính."])

for sheet in wb.worksheets:
    sheet.freeze_panes = "A2"
    sheet.sheet_view.showGridLines = False
    for cell in sheet[1]:
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill("solid", fgColor="1F4E78")
        cell.alignment = Alignment(vertical="top", wrap_text=True)
    for row in sheet.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(vertical="top", wrap_text=True)
    for column in sheet.columns:
        letter = column[0].column_letter
        max_len = max(len(str(cell.value or "")) for cell in column)
        sheet.column_dimensions[letter].width = min(max(max_len + 2, 14), 58)
    if sheet.max_row > 1 and sheet.max_column > 1 and all(cell.value is not None for cell in sheet[1]):
        table = Table(displayName=f"Table{wb.sheetnames.index(sheet.title) + 1}", ref=sheet.dimensions)
        table.tableStyleInfo = TableStyleInfo(
            name="TableStyleMedium2",
            showFirstColumn=False,
            showLastColumn=False,
            showRowStripes=True,
            showColumnStripes=False,
        )
        sheet.add_table(table)

for cell in inputs["B"]:
    cell.number_format = "0.000000"
for row in range(2, scale.max_row + 1):
    for col in [4, 5, 6, 7, 8]:
        scale.cell(row, col).number_format = "0.0000"

wb.calculation.fullCalcOnLoad = True
wb.calculation.forceFullCalc = True
wb.calculation.calcMode = "auto"
wb.save(OUTPUT)

check = load_workbook(OUTPUT, data_only=False)
assert check.sheetnames == ["Huong dan", "Inputs", "Unit cost", "Scale", "Sensitivity", "Nguon"]
assert check["Scale"].max_row == 37
assert check["Unit cost"].max_row == 13
assert check["Unit cost"]["I3"].value.startswith("=IF(COUNT(")
assert "CHƯA XÁC MINH" in check["Unit cost"]["I3"].value
assert check["Unit cost"]["L2"].value.startswith("=IF(OR(")
assert check["Scale"]["H2"].value.startswith("=IF(OR(")
assert check["Inputs"].cell(assumption_key_row["ARPU per paid subscriber per month"], 2).value is None
print(f"Created {OUTPUT.name}: sheets={check.sheetnames}; live formulas present; 36 scale rows.")
