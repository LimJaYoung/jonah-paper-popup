# 분리 소재 제작 기록

도구: 내장 image_gen.imagegen, transparent_background=true. 모든 호출에서 사용자의 3컷 참고 이미지를 referenced_image_paths로 제공했다. 생성 이미지는 프로젝트 assets/로 복사하고 원본을 보존했다. 원본의 정확한 분리본이 아니라 참고 기반 재제작 소재다.

## 최종 프롬프트 세트

- whale.png: ONLY the blue whale from the right-hand final scene of reference, isolated complete body with tail, facing left. Match friendly silhouette, azure blue textured handmade paper, cream pleated belly, tiny brown eye. Reconstruct obscured lower body gracefully. Orthographic straight-on flat cut paper art for a 3D pop-up card texture. No waves, boat, Jonah, book, ground, exterior cast shadow or text. Entire whale visible, transparent margins and background, rich tactile fibrous paper and layered contours.
- waves.png: Single isolated long horizontal cut-paper ocean wave layer, three sweeping curling waves, teal turquoise cyan with elaborate cream foam crest like final panel. Rich fibrous grain, stacked concentric contour ribbons with fine dark edges. Straight bottom edge for page attachment, low center valley, highest curls on left and right. Orthographic, transparent, no perspective or other objects, wide 2.8:1.
- waves-middle.png: Single MIDGROUND WAVE layer, enormous curling turquoise wave on LEFT, lower curl in center, RIGHT very low for boat visibility. Wide 2.8:1 with straight attachment bottom. Concentric teal blue strips, pale cyan highlights, cream frothy crest, organic droplets and lace holes. Handmade grain, internal paper shadows, transparent background, orthographic. No exterior glow/shadow or other objects, no green.
- boat.png: Single isolated coral orange paper sailboat matching last panel, NO person/Jonah. Complete curved coral hull with yellow gold trim and delicate horizontal planks; cream billowing sail with yellow stripe, gold mast ropes. Fibrous tactile paper, layered edges. Orthographic straight-on side view facing right, entire hull unobscured, transparent background, no water/book/ground shadows.
- jonah.png: Isolated small friendly Jonah like last panel: smiling brown-bearded man, short brown hair, cream robe, coral vest/scarf, yellow belt, both arms raised with open hands, sandals. Full body visible, tactile paper cutout and subtle layered shadows. Straight front view, transparent, no exterior glow/shadow or other objects. Cute adult storybook proportions, recognizable face and clothing.

브라우저 구현은 알파 임계값으로 외곽의 반투명 번짐을 제외하고 윤곽에 얇은 종이 절단면을 붙인다. 원화의 픽셀 자체는 변경하지 않는다.
