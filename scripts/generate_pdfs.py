from __future__ import annotations

import json
import re
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate, Frame, NextPageTemplate, PageBreak, PageTemplate, Paragraph,
    Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'tmp' / 'artifact-content.json').read_text(encoding='utf-8'))
GUIDE_DIR = ROOT / 'public' / 'downloads' / 'guides'
SHEET_DIR = ROOT / 'public' / 'downloads' / 'quick-sheets'
GUIDE_DIR.mkdir(parents=True, exist_ok=True)
SHEET_DIR.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor('#071C33')
BLUE = colors.HexColor('#456FF2')
TEAL = colors.HexColor('#26C9B5')
CORAL = colors.HexColor('#F17C8E')
INK = colors.HexColor('#15324B')
MUTED = colors.HexColor('#5D7286')
PALE = colors.HexColor('#EEF4F8')
LINE = colors.HexColor('#DCE6EF')


def clean(value: object) -> str:
    text = str(value)
    replacements = {'\u2013': '-', '\u2014': '-', '\u2011': '-', '\u2212': '-', '\u2018': "'", '\u2019': "'", '\u201c': '"', '\u201d': '"', '\u2026': '...', '\u2192': '->', '\u00b7': '-'}
    for source, target in replacements.items():
        text = text.replace(source, target)
    return text.encode('latin-1', 'replace').decode('latin-1')


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='CoverEyebrow', fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=TEAL, tracking=1.4, spaceAfter=16))
styles.add(ParagraphStyle(name='CoverTitle', fontName='Helvetica-Bold', fontSize=31, leading=34, textColor=colors.white, spaceAfter=14))
styles.add(ParagraphStyle(name='CoverSub', fontName='Helvetica', fontSize=12, leading=18, textColor=colors.HexColor('#C5D5E2')))
styles.add(ParagraphStyle(name='SectionTitle', fontName='Helvetica-Bold', fontSize=19, leading=23, textColor=NAVY, spaceAfter=10))
styles.add(ParagraphStyle(name='Subhead', fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=BLUE, spaceBefore=6, spaceAfter=5))
styles.add(ParagraphStyle(name='BodySmall', fontName='Helvetica', fontSize=9.2, leading=13.5, textColor=MUTED, spaceAfter=6))
styles.add(ParagraphStyle(name='BulletSmall', fontName='Helvetica', fontSize=9.1, leading=13.2, textColor=MUTED, leftIndent=13, firstLineIndent=-8, bulletIndent=4, spaceAfter=4))
styles.add(ParagraphStyle(name='Callout', fontName='Helvetica-Bold', fontSize=10, leading=14, textColor=INK, leftIndent=7, rightIndent=7, spaceAfter=5))
styles.add(ParagraphStyle(name='Footer', fontName='Helvetica', fontSize=7, leading=9, textColor=MUTED))


def header_footer(canvas, doc):
    canvas.saveState()
    if doc.page > 1:
        canvas.setStrokeColor(LINE); canvas.line(0.65 * inch, 0.58 * inch, 7.85 * inch, 0.58 * inch)
        canvas.setFont('Helvetica', 7); canvas.setFillColor(MUTED)
        canvas.drawString(0.65 * inch, 0.39 * inch, 'NURSING with LOLO - independent study aid')
        canvas.drawRightString(7.85 * inch, 0.39 * inch, f'{doc.page}')
    canvas.restoreState()


def cover_page(canvas, doc):
    canvas.saveState(); canvas.setFillColor(NAVY); canvas.rect(0, 0, letter[0], letter[1], fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor('#123B62')); canvas.circle(7.7 * inch, 9.6 * inch, 2.15 * inch, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor('#133153')); canvas.circle(7.0 * inch, 0.7 * inch, 2.6 * inch, fill=1, stroke=0)
    canvas.restoreState()


def build_doc(path: Path, title: str, story: list, cover: bool = True):
    frame = Frame(0.67 * inch, 0.72 * inch, 7.16 * inch, 9.72 * inch, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    templates = [PageTemplate(id='cover', frames=[frame], onPage=cover_page), PageTemplate(id='body', frames=[frame], onPage=header_footer)] if cover else [PageTemplate(id='body', frames=[frame], onPage=header_footer)]
    doc = BaseDocTemplate(str(path), pagesize=letter, rightMargin=0.67 * inch, leftMargin=0.67 * inch, topMargin=0.72 * inch, bottomMargin=0.72 * inch, title=clean(title), author='NURSING with LOLO', subject='Independent nursing study aid')
    doc.addPageTemplates(templates)
    doc.build(story)


def bullet_list(items):
    return [Paragraph(f'- {clean(item)}', styles['BulletSmall']) for item in items]


def section_page(title, intro, sections):
    result = [Paragraph(clean(title), styles['SectionTitle']), Paragraph(clean(intro), styles['BodySmall']), Spacer(1, 6)]
    for heading, items in sections:
        result.append(Paragraph(clean(heading), styles['Subhead'])); result.extend(bullet_list(items))
    return result


def guide_story(resource):
    q1 = resource['questions'][0]
    q2 = resource['questions'][1] if len(resource['questions']) > 1 else q1
    story = [Spacer(1, 1.5 * inch), Paragraph('NURSING WITH LOLO', styles['CoverEyebrow']), Paragraph(clean(resource['title']), styles['CoverTitle']), Paragraph(clean(resource['description']), styles['CoverSub']), Spacer(1, 0.35 * inch), Paragraph('Simple explanations - nursing priorities - memory cues - original practice - rationales', styles['CoverSub']), Spacer(1, 2.65 * inch), Paragraph(f"Reviewed {clean(resource['reviewedDate'])}<br/>Educational study aid - verify current instructor and facility requirements", styles['CoverSub']), NextPageTemplate('body'), PageBreak()]
    story += section_page('What you will be able to do', 'Use these objectives to guide active recall before and after the lesson.', [('Learning objectives', resource['objectives']), ('How to use this guide', ['Read the simple overview once.', 'Close the guide and explain the priority in your own words.', 'Answer the practice items before opening the rationale.', 'Return to the lowest-confidence section tomorrow.'])]) + [PageBreak()]
    story += section_page('The concept, made simple', 'Plain language first; precise nursing language follows.', [('Core explanations', resource['simplified']), ('Vocabulary move', ['Name the body system or safety process.', 'Connect the cue to the risk.', 'State what the nurse should notice and do first.'])]) + [PageBreak()]
    story += section_page('Assess before you act', 'A focused assessment organizes the data that make the next action safe.', [('What to notice', resource['assessments']), ('Trend, do not snapshot', ['Compare with baseline.', 'Cluster related cues.', 'Validate unexpected values.', 'Escalate time-sensitive changes.'])]) + [PageBreak()]
    story += section_page('Priority actions and safety boundaries', 'The safest answer protects the client while staying inside role, order, and policy.', [('Priority actions', resource['priorities']), ('Safety warnings', resource['safety'])]) + [PageBreak()]
    story += section_page('Memory that transfers', 'A memory aid is useful only when it leads back to clinical reasoning.', [('Memory hooks', resource['memory']), ('Exam reset', ['What can harm the client first?', 'What data are missing?', 'Is the client stable or unstable?', 'Which action is least restrictive and within scope?'])]) + [PageBreak()]
    example = resource['clinicalExample']
    story += section_page('Clinical judgment in motion', example['scenario'], [('Notice', example['notice']), ('Interpret', example['interpret']), ('Respond', example['respond']), ('Reflect', [example['reflect']])]) + [PageBreak()]
    story += [Paragraph('Practice before the rationale', styles['SectionTitle']), Paragraph('Choose the best answer using the cue-risk-action sequence.', styles['BodySmall'])]
    for number, question in enumerate((q1, q2), start=1):
        story.append(Paragraph(f'Question {number}', styles['Subhead'])); story.append(Paragraph(clean(question['prompt']), styles['BodySmall']))
        for idx, option in enumerate(question['options']): story.append(Paragraph(f"{chr(65+idx)}. {clean(option)}", styles['BulletSmall']))
        story.append(Spacer(1, 9))
    story.append(PageBreak())
    story += [Paragraph('Answers, rationales, and printable review', styles['SectionTitle'])]
    for number, question in enumerate((q1, q2), start=1):
        answer = ', '.join(chr(65 + int(index)) for index in question['correct'])
        story.append(Paragraph(f'Question {number}: {answer}', styles['Subhead'])); story.append(Paragraph(clean(question['rationale']), styles['BodySmall'])); story.append(Paragraph(f"Exam clue: {clean(question['testTakingClue'])}", styles['Callout']))
    story.append(Spacer(1, 9)); story.append(Paragraph('Five-point review', styles['Subhead'])); story.extend(bullet_list(resource['summary'][:5])); story.append(Paragraph('References', styles['Subhead']))
    for source in resource['sources'][:5]: story.append(Paragraph(clean(f"{source['organization']}: {source['title']} - {source['url']}"), styles['Footer']))
    story.append(Spacer(1, 9)); story.append(Paragraph('NURSING with LOLO is an independent educational study aid. It is not medical advice, an accredited nursing program, a guarantee of exam performance, or a replacement for current clinical references, instructor direction, scope rules, orders, manufacturer instructions, or facility policy.', styles['Footer']))
    return story


def quick_sheet_story(sheet):
    title_style = ParagraphStyle('SheetTitle', parent=styles['SectionTitle'], fontSize=22, leading=25, textColor=NAVY, alignment=TA_LEFT)
    story = [Paragraph('NURSING WITH LOLO - QUICK STUDY', styles['CoverEyebrow']), Paragraph(clean(sheet['title']), title_style), Paragraph(clean(sheet['description']), styles['BodySmall']), Spacer(1, 7)]
    data = []
    for section in sheet['sections']:
        content = [Paragraph(clean(section['heading']), styles['Subhead'])] + bullet_list(section['points'])
        data.append(content)
    rows = []
    for index in range(0, len(data), 2): rows.append([data[index], data[index + 1] if index + 1 < len(data) else ''])
    table = Table(rows, colWidths=[3.48 * inch, 3.48 * inch], hAlign='LEFT')
    table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('BOX', (0,0), (-1,-1), 0.7, LINE), ('INNERGRID', (0,0), (-1,-1), 0.5, LINE), ('BACKGROUND', (0,0), (-1,-1), PALE), ('LEFTPADDING', (0,0), (-1,-1), 10), ('RIGHTPADDING', (0,0), (-1,-1), 10), ('TOPPADDING', (0,0), (-1,-1), 7), ('BOTTOMPADDING', (0,0), (-1,-1), 7)]))
    story += [table, Spacer(1, 8), Paragraph(clean(f"Reviewed {sheet['reviewedDate']} - Source: {sheet['source']['organization']} - {sheet['source']['url']}"), styles['Footer']), Paragraph('Study aid only. Verify current references, instructor guidance, scope, orders, and facility policy.', styles['Footer'])]
    return story


for resource in DATA['resources']:
    build_doc(GUIDE_DIR / f"{resource['id']}.pdf", resource['title'], guide_story(resource), cover=True)

for sheet in DATA['quickSheets']:
    build_doc(SHEET_DIR / f"{sheet['id']}.pdf", sheet['title'], quick_sheet_story(sheet), cover=False)


def merge(paths, output):
    writer = PdfWriter()
    for path in paths:
        for page in PdfReader(str(path)).pages: writer.add_page(page)
    with open(output, 'wb') as handle: writer.write(handle)


merge(sorted(SHEET_DIR.glob('*.pdf')), ROOT / 'public' / 'downloads' / 'nursing-with-lolo-quick-sheet-bundle.pdf')
merge(sorted(GUIDE_DIR.glob('*.pdf')), ROOT / 'public' / 'downloads' / 'nursing-with-lolo-study-guide-bundle.pdf')
print(f"Generated {len(DATA['resources'])} study guides and {len(DATA['quickSheets'])} quick sheets.")
