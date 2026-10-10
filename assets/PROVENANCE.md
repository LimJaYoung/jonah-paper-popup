# 분리 소재 제작 기록

도구: 내장 image_gen.imagegen, transparent_background=true. 모든 호출에서 사용자의 3컷 참고 이미지를 referenced_image_paths로 제공했다. 생성 이미지는 프로젝트 assets/로 복사하고 원본을 보존했다. 원본의 정확한 분리본이 아니라 참고 기반 재제작 소재다.

## 최종 프롬프트 세트

- whale.png: ONLY the blue whale from the right-hand final scene of reference, isolated complete body with tail, facing left. Match friendly silhouette, azure blue textured handmade paper, cream pleated belly, tiny brown eye. Reconstruct obscured lower body gracefully. Orthographic straight-on flat cut paper art for a 3D pop-up card texture. No waves, boat, Jonah, book, ground, exterior cast shadow or text. Entire whale visible, transparent margins and background, rich tactile fibrous paper and layered contours.
- waves.png: Single isolated long horizontal cut-paper ocean wave layer, three sweeping curling waves, teal turquoise cyan with elaborate cream foam crest like final panel. Rich fibrous grain, stacked concentric contour ribbons with fine dark edges. Straight bottom edge for page attachment, low center valley, highest curls on left and right. Orthographic, transparent, no perspective or other objects, wide 2.8:1.
- waves-middle.png: Single MIDGROUND WAVE layer, enormous curling turquoise wave on LEFT, lower curl in center, RIGHT very low for boat visibility. Wide 2.8:1 with straight attachment bottom. Concentric teal blue strips, pale cyan highlights, cream frothy crest, organic droplets and lace holes. Handmade grain, internal paper shadows, transparent background, orthographic. No exterior glow/shadow or other objects, no green.
- boat.png: Single isolated coral orange paper sailboat matching last panel, NO person/Jonah. Complete curved coral hull with yellow gold trim and delicate horizontal planks; cream billowing sail with yellow stripe, gold mast ropes. Fibrous tactile paper, layered edges. Orthographic straight-on side view facing right, entire hull unobscured, transparent background, no water/book/ground shadows.
- jonah.png: Isolated small friendly Jonah like last panel: smiling brown-bearded man, short brown hair, cream robe, coral vest/scarf, yellow belt, both arms raised with open hands, sandals. Full body visible, tactile paper cutout and subtle layered shadows. Straight front view, transparent, no exterior glow/shadow or other objects. Cute adult storybook proportions, recognizable face and clothing.

브라우저 구현은 알파 임계값으로 외곽의 반투명 번짐을 제외하고 윤곽에 얇은 종이 절단면을 붙인다. 원화의 픽셀 자체는 변경하지 않는다.

## 본문 씬 1 · 2026-10-09

내장 ImageGen 사용. 기존 소재는 변경하지 않았다. 생성 소재는 프로젝트에 복사했다.
- `nineveh.png`: 기존 jonah.png와 책 캡처를 스타일 참고로 제공. 최종 프롬프트: Use case illustration-story. Reference images style only: match exactly the tactile fibrous layered cut-paper of this existing Jonah popup book. Create ONE isolated ancient Nineveh city gateway with crenellated cream and apricot walls, large teal arched door, tiny muted golden yellow accents, a few overlapping flat roof houses behind it. Warm cream handmade textured paper with crisp layered edges and subtle internal shadows. Wide front elevation, straight horizontal bottom attachment edge, entire silhouette visible. This will be a single upright cutout in existing Three.js pop-up, not a new scene. No book, people, boat, whale, water, ground, sky, lettering, external shadows, glow. Genuine transparent background.
- `houses.png`: 생성 성문을 스타일 참고로 제공. 최종 프롬프트: Create one isolated row of 5 ancient Nineveh small houses, orthographic front elevation, no gate or walls. Match reference exactly: rich fibrous layered handmade cut-paper texture, cream and soft apricot, teal tiny doors and mustard yellow flat roof trims, a few low domes. Stepped skyline with small overlaps, straight bottom attachment edge. Wide 3:1 silhouette with transparent background. No sky ground book people lettering or external shadows/glow. This asset will be a background paper layer behind the reference gate, identical material and lighting.
- 본문 요나와 배는 기존 `jonah.png`, `boat.png` 재사용. 요나의 머리·몸·발 관절은 같은 텍스처의 UV 구간으로 분리하며 원화 파일은 변경하지 않음.

## 요나 뒷모습 · 2026-10-09

내장 ImageGen으로 기존 jonah.png를 참조해 `jonah-back.png`를 추가했다. 앞면 원화는 보존했다.
최종 프롬프트: Use case identity-preserve. Edit target is this exact cut paper Jonah character. Create the REVERSE SIDE artwork for the SAME paper doll viewed directly from behind. Preserve the exact front reference's full-body silhouette, outline, proportions, pose with BOTH arms raised, head size, hemline and foot positions, matching frame and scale. Keep identical brown layered hair, cream robe, coral sleeveless outer garment, yellow waist belt, brown sandals and tactile handmade paper grain. Show back of hair with NO face, NO eyes, NO nose, NO mouth and NO beard on the back. Back of coral vest is a continuous panel, cream sleeves, belt wraps around waist; rear heels/sandal straps rather than toes. Orthographic rear elevation, no perspective. This will texture the reverse of a rotating flat 3D paper doll, must register to the original silhouette. Entire figure visible on genuinely transparent background, no book, ground, scenery, text, exterior glow or shadow. Preserve original art style meticulously.

## Scene 2 sailor (2026-10-09)
- `sailor.png`: generated with imagegen using existing `jonah.png` as the paper-style reference. Transparent adult sailor, teal headscarf/vest, cream tunic, mustard sash. Original saved in Codex generated_images; copied without replacing original assets.
- Prompt: isolated friendly adult ancient sailor in exactly the existing layered fibrous handmade cut-paper style, full body, arms raised for shoulder articulation, transparent background, no text or ship.
- Scene 2 reuses original boat, Jonah front/back, houses and wave assets. Dock and cabin use the existing procedural cardstock materials.
