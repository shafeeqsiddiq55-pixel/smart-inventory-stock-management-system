--
-- PostgreSQL database dump
--

\restrict iN1jDOob56zjlBzkhzrvQ5yLTIxSh9fipheVf8kQZRe2gLapaT74J1pTFnZdhzq

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, description, image_url, created_at, updated_at) FROM stdin;
1	Fresh Fruits	fresh-fruits	Fresh seasonal fruits	\N	2026-07-20 12:05:22.034016+05:30	2026-07-20 12:05:22.034016+05:30
2	Dry Fruits	dry-fruits	Premium dry fruits	\N	2026-07-20 12:05:22.034016+05:30	2026-07-20 12:05:22.034016+05:30
3	Organic	organic	Organic fruits	\N	2026-07-20 12:05:22.034016+05:30	2026-07-20 12:05:22.034016+05:30
4	Imported	imported	Imported fruits	\N	2026-07-20 12:05:22.034016+05:30	2026-07-20 12:05:22.034016+05:30
5	Combos	combos	Fruit combo packs	\N	2026-07-20 12:05:22.034016+05:30	2026-07-20 12:05:22.034016+05:30
6	Gift Packs	gift-packs	Gift fruit packs	\N	2026-07-20 12:05:22.034016+05:30	2026-07-20 12:05:22.034016+05:30
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, slug, category_id, description, price, discount_price, stock, image_url, is_featured, is_organic, weight_options, nutrition_info, health_benefits, sales_count, created_at, updated_at) FROM stdin;
17	Red Banana	red-banana-1785302530973	1	Naturally sweet, rich, and creamy! Our premium red bananas have a unique, berry-like sweet flavor with a smoother, softer texture than regular yellow bananas. Great for fresh eating, smoothies, fruit bowls, and healthy desserts.	15.00	\N	65	https://www.organicgrocer.co.in/cdn/shop/files/Redbanana.jpg?v=1769451099	t	f	1kg	(Per 100g serving)\nEnergy: 90 kcal\nProtein: 1.3 g\nTotal Fat: 0.3 g\n\nCarbohydrates: 22.8 g\nDietary Fiber: 2.6 g\nSugar: 12.2 g	Rich in Vitamin C & B6, boosts heart health, supports immune function, and aids healthy digestion.	0	2026-07-29 10:52:11.047166+05:30	2026-07-29 11:38:11.5+05:30
22	walnut	walnut-1785303283860	2	Rich, crunchy, and packed with essential nutrients! Our premium quality walnuts are carefully selected to give you fresh, natural goodness in every bite. Perfect for snacking, baking, or boosting your daily wellness.	1000.00	\N	100	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7jRNywpv1SxFkRRR-NsdG1DtATsE3B0zTtdTgLoAVHg&s=10	t	f	1kg	Nutritional Info (Per 28g / 1 oz serving):\nEnergy: 185 kcal\nProtein: 4.3 g\nTotal Fat: 18.5 g (Rich in Omega-3)\nCarbohydrates: 3.9 g\nDietary Fiber: 1.9 g\nSugar: 0.7 g	Supports brain function, boosts heart health, rich in antioxidants, and aids digestion.	0	2026-07-29 11:04:43.919959+05:30	2026-07-29 11:24:37.223+05:30
9	Gift Fruit Pack	gift-pack	6	Premium Gift Pack	799.00	\N	77	/src/assets/generated_images/gift-pack.jpg	t	f	\N	\N	\N	0	2026-07-20 12:08:46.342579+05:30	2026-08-28 18:39:56.816+05:30
20	black grapess	black-grapess-1785302980965	2	Naturally sweet, plump, and full of flavor! Our premium dried black grapes (black raisins) are carefully naturally dried to lock in their rich taste and high nutritional value. A delicious addition to daily snacking, desserts, cereal, and baking.	800.00	\N	100	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6vHX4l4A73gmNRufh8ba4Apl1gvow9bUDPLMSDq-dbQ&s=10	t	f	1kg	(Per 28g / 1 oz serving)\nEnergy: 84 kcal\nProtein: 0.9 g\nTotal Fat: 0.1 g\nCarbohydrates: 22 g\nDietary Fiber: 1.9 g\nSugar: 18 g	Purifies blood, boosts iron levels, helps manage blood pressure, and improves digestion.	0	2026-07-29 10:59:41.026776+05:30	2026-07-29 11:30:38.801+05:30
18	pomegranate[medium]	pomegranate-medium-1785302700070	1	Fresh, juicy, and perfectly portioned! Our premium medium pomegranates feature vibrant red arils packed with sweet-tart flavor. A refreshing choice for snacking, garnishing meals, or preparing fresh juice.	300.00	\N	100	https://plantsguru.com/cdn/shop/files/Ripe-Pomegranate-Fruit-on-Tree-Branch.jpg?v=1755687567	t	f	1kg	(Per 100g serving)\nEnergy: 83 kcal\nProtein: 1.7 g\nTotal Fat: 1.2 g\nCarbohydrates: 18.7 g\nDietary Fiber: 4.0 g\nSugar: 13.7 g	Rich in antioxidants, supports heart health, boosts immunity, and aids digestion.	0	2026-07-29 10:55:00.135092+05:30	2026-07-29 11:36:08.003+05:30
14	Sweet Lemon 	sweet-lemon-1785301944623	1	Juicy, mildly sweet, and deeply refreshing! Our fresh sweet lemons (Mosambi) are carefully selected for high juice yield and a soft, pleasing flavor. Perfect for making fresh homemade juice, fruit salads, or enjoyed on a hot day for instant hydration.	180.00	\N	100	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYEHE2OMQna4GZzZJ1Ylep1eI-7Sg5VOuzU70122Lymw&s=10	t	f	1kg 	(Per 100g serving)\nEnergy: 43 kcal\nProtein: 0.7 g\nTotal Fat: 0.3 g\nCarbohydrates: 10.5 g\nDietary Fiber: 0.8 g\nSugar: 6.2 g	Packed with Vitamin C, aids detoxification, improves digestion, and boosts skin radiance.	0	2026-07-29 10:42:24.688633+05:30	2026-07-29 11:46:10.922+05:30
4	Almond	almond	2	Nutritious, crunchy, and rich in natural goodness! Our premium whole almonds are carefully selected for superior size, fresh crunch, and delicious flavor. Perfect for daily snacking, soaking overnight, blending into almond milk, or adding a healthy touch to desserts and baking.	950.00	\N	50	https://sangamsweets.in/cdn/shop/files/AlmondsCaliforniaNew.webp?v=1745318528	t	f	1kg	(Per 28g / 1 oz serving)\nEnergy: 164 kcal\nProtein: 6.0 g\nTotal Fat: 14.2 g\nCarbohydrates: 6.1 g\nDietary Fiber: 3.5 g\nSugar: 1.2 g	High in Vitamin E, supports heart health, improves memory, and helps manage weight.	0	2026-07-20 12:08:46.342579+05:30	2026-07-29 12:08:37.613+05:30
5	Cashew	cashew	2	Rich, buttery, and naturally crunchy! Our premium whole cashews are carefully selected to ensure a delicate sweetness and creamy texture in every bite. Perfect for healthy snacking, making creamy sauces, garnishing sweets, or adding to stir-fries and baked goods.	550.00	\N	40	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWQsVvPTQw7W5LfXLugt5cUQtP1IddLOliUzKI8BS_Gw&s=10	t	f	1kg	(Per 28g / 1 oz serving)\nEnergy: 157 kcal\nProtein: 5.2 g\nTotal Fat: 12.4 g\nCarbohydrates: 8.6 g\nDietary Fiber: 0.9 g\nSugar: 1.7 g	Supports heart health, strengthens bones, boosts energy, and aids nerve function.	0	2026-07-20 12:08:46.342579+05:30	2026-07-29 11:56:02.082+05:30
16	Pine Apple	pine-apple-1785302344915	1	Sweet, tangy, and refreshingly tropical! Our premium fresh pineapples are hand-picked at peak ripeness to deliver maximum juiciness and vibrant flavor. Perfect for fresh slicing, blending into smoothies, tossing into fruit salads, or grilling.	100.00	\N	77	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMrB91l_KoB4SG-MWsk15WIq3NhjdWHzGRuqdcK_Va3A&s=10	t	f	1kg	(Per 100g serving)\nEnergy: 50 kcal\nProtein: 0.5 g\nTotal Fat: 0.1 g\nCarbohydrates: 13.1 g\nDietary Fiber: 1.4 g\nSugar: 9.9 g	Rich in Vitamin C, aids digestion with bromelain, boosts immunity, and reduces inflammation.	0	2026-07-29 10:49:04.973907+05:30	2026-08-28 18:40:24.766+05:30
8	Fruit Combo	fruit-combo	5	Mixed Fruit Combo Pack	399.00	\N	20	/src/assets/generated_images/Fruits-Combo.jpg	t	f	\N	\N	\N	0	2026-07-20 12:08:46.342579+05:30	2026-07-20 12:08:46.342579+05:30
3	nagpur Orange	orange	1	Juicy Oranges	180.00	\N	80	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjNJ1b6-SPaDNg2RFgijaF0LNDU4Hk59UfKMX8UmuQ7A&s=10	t	f	\N	\N	\N	2	2026-07-20 12:08:46.342579+05:30	2026-07-27 17:58:33.342+05:30
19	pomegranate[large]	pomegranate-large-1785302825754	1	Juicy, vibrant, and bursting with fresh flavor! Our premium large pomegranates are hand-selected for maximum sweetness, crisp arils, and rich juice content. Perfect for fresh eating, tossing into salads, blending into fresh juice, or garnishing gourmet dishes.	340.00	\N	98	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtsf7CtAXeeiKaLNILujU4gEGPKcuw4rK_leIdGbAqKw&s=10	t	f	1kg	(Per 100g serving)\nEnergy: 83 kcal\nProtein: 1.7 g\nTotal Fat: 1.2 g\nCarbohydrates: 18.7 g\nDietary Fiber: 4.0 g\nSugar: 13.7 g	Rich in antioxidants, supports heart health, boosts immunity, and aids digestion.	1	2026-07-29 10:57:05.830147+05:30	2026-08-29 16:20:45.527+05:30
15	Black Grapees[Panner]	black-grapees-panner-1785302128838	1	Sweet, aromatic, and distinctly flavorful! Our fresh Paneer Black Grapes are carefully hand-picked to deliver rich juice and a signature sweet-tart flavor profile. Ideal for fresh snacking, preparing authentic fruit juices, making jams, or garnishing desserts.	160.00	\N	100	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNrM7bC-5JXIraHWwtk0W9g0oS_3lonF3AayH__7h9ZA&s=10	t	f	1kg	(Per 100g serving)\nEnergy: 69 kcal\nProtein: 0.7 g\nTotal Fat: 0.2 g\nCarbohydrates: 18.1 g\nDietary Fiber: 0.9 g\nSugar: 15.5 g	Rich in antioxidants, supports heart health, improves skin vitality, and boosts hydration.	0	2026-07-29 10:45:28.898089+05:30	2026-07-29 11:44:01.925+05:30
12	green grapes[seed]	green-grapes-seed-1785154661740	1	Naturally sweet, juicy, and full of traditional flavor! Our fresh seeded green grapes are hand-selected for premium quality and crispness. Perfect for fresh snacking, making refreshing homemade juices, or serving as a wholesome table fruit.	160.00	\N	99	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-QGcYRxF8LVnUEO98QIgj5J0HSCxdPfr6iTy2fdArgc1GX2maVzGcu-k&s=10	t	f	1kg	(Per 100g serving)\nEnergy: 69 kcal\nProtein: 0.7 g\nTotal Fat: 0.2 g\nCarbohydrates: 18.1 g\nDietary Fiber: 0.9 g\nSugar: 15.5 g	Rich in Vitamin C & K, supports heart health, provides fast natural hydration, and boosts immunity.	0	2026-07-27 17:47:41.82538+05:30	2026-07-29 11:49:12.31+05:30
11	mango	mango-1785154359395	1	Naturally sweet, juicy, and rich in tropical flavor! Our premium fresh mangoes are hand-picked at peak maturity to deliver maximum aroma and delicious taste. Perfect for eating fresh, blending into smoothies and lassis, preparing fresh fruit bowls, or adding to desserts.	140.00	\N	100	https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Mangos_-_single_and_halved.jpg/500px-Mangos_-_single_and_halved.jpg	t	f	1kg	(Per 100g serving)\nEnergy: 60 kcal\nProtein: 0.8 g\nTotal Fat: 0.4 g\nCarbohydrates: 15.0 g\nDietary Fiber: 1.6 g\nSugar: 13.7 g	Rich in Vitamin A & C, supports immune health, aids digestion, and promotes glowing skin.	0	2026-07-27 17:42:39.492317+05:30	2026-07-29 11:52:22.914+05:30
2	Nenthiram pazham	banana	1	Naturally rich, firm, and deliciously sweet! Our premium Nenthiram Pazham (Nendran Bananas) are sourced at prime ripeness, known for their distinct golden hue and thick, creamy texture. Perfect for fresh eating, steaming, making authentic Kerala banana chips, or preparing delicious traditional desserts like Unnakaya and Pazham Pori.	80.00	\N	150	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7henAkBFCrpVmNgBbKIYOmVAGMwCNDRK4jDO0h418rQ&s=10	t	f	1kg	(Per 100g serving)\nEnergy: 116 kcal\nProtein: 1.2 g\nTotal Fat: 0.3 g\nCarbohydrates: 29.3 g\nDietary Fiber: 2.3 g\nSugar: 16.8 g	High in potassium, aids digestion, boosts energy, and supports muscle function.	2	2026-07-20 12:08:46.342579+05:30	2026-07-29 12:02:17.505+05:30
7	Kiwi	kiwi	1	Tangy-sweet, juicy, and packed with vibrant tropical flavor! Our premium imported kiwi fruit features a soft texture and a refreshingly unique sweet-tart taste. Perfect for fresh slicing, adding to fruit salads, blending into smoothies, or garnishing gourmet desserts.	180.00	\N	12	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQez1szXlEOyNRx5gUrSLvB_yY0EmmWnMrRZEsdoqioSg&s=10	t	f	1[box]	(Per 100g serving)\nEnergy: 61 kcal\nProtein: 1.1 g\nTotal Fat: 0.5 g\nCarbohydrates: 14.7 g\nDietary Fiber: 3.0 g\nSugar: 9.0 g	Exceptionally high in Vitamin C, boosts immunity, aids healthy digestion, and supports heart wellness.	0	2026-07-20 12:08:46.342579+05:30	2026-07-29 12:18:37.13+05:30
1	Apple[delecious]	apple	4	Crisp, classic, and naturally sweet! Our premium Red Delicious apples are known for their vibrant deep red skin, juicy crunch, and mildly sweet flavor. A timeless favorite for fresh snacking, slicing into salads, pairing with cheese, or adding to healthy lunchboxes.	300.00	\N	100	https://static.wixstatic.com/media/d1d704_04700068be9945d3b0cccf1ba6038e58~mv2.jpg/v1/fill/w_420,h_420,al_c,lg_1,q_80,enc_avif,quality_auto/d1d704_04700068be9945d3b0cccf1ba6038e58~mv2.jpg	t	f	1kg	(Per 100g serving)\nEnergy: 52 kcal\nProtein: 0.3 g\nTotal Fat: 0.2 g\nCarbohydrates: 13.8 g\nDietary Fiber: 2.4 g\nSugar: 10.4 g	Rich in fiber, supports heart health, aids weight management, and promotes digestion.	1	2026-07-20 12:08:46.342579+05:30	2026-07-29 12:20:28.153+05:30
6	Apple[Royal gala]	organic-apple	4	Sweet, crisp, and beautifully striped! Our premium Royal Gala apples feature a delicate floral aroma, thin skin, and fine-textured yellow flesh. A favorite for fresh daily snacking, slicing into salads, making applesauce, or pairing with cheese.	340.00	\N	100	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWvldEFVYV0azsydBeB0WP5fRm5Eouy7zjLcbJq1YSEw&s=10	t	f	1kg	(Per 100g serving)\nEnergy: 52 kcal\nProtein: 0.3 g\nTotal Fat: 0.2 g\nCarbohydrates: 13.8 g\nDietary Fiber: 2.4 g\nSugar: 10.4 g	Rich in dietary fiber, supports heart health, aids digestion, and promotes healthy immunity.	0	2026-07-20 12:08:46.342579+05:30	2026-07-29 12:20:55.979+05:30
21	white grapees	white-grapees-1785303189352	2	Naturally sweet, soft, and chewy! Our premium white raisins are made from carefully dried seedless white grapes. Perfect for daily snacking, baking, topping desserts, or adding a rich sweetness to your favorite dishes.	850.00	\N	100	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRma9BLMKfY9IlEllCnzCPayXVSgi7tciLojgK-KHLHug&s=10	t	f	1kg	(Per 28g / 1 oz serving)\nEnergy: 85 kcal\nProtein: 0.9 g\nTotal Fat: 0.1 g\nCarbohydrates: 22 g\nDietary Fiber: 1.0 g\nSugar: 17 g	Boosts energy, improves digestion, supports bone health, and aids blood circulation.	0	2026-07-29 11:03:09.420521+05:30	2026-08-24 16:12:29.705+05:30
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, full_name, email, phone, address, password_hash, role, status, created_at, updated_at) FROM stdin;
2	arun	arun@gmail.com	7890564321	run,covai,65	$2b$10$o3fCVdpc.g1zZ0T2Mz7sWu6fzfieSackrmkC2ZCXNLhPzOqybxbZm	customer	active	2026-07-27 09:13:13.431906+05:30	2026-07-27 09:13:13.431906+05:30
3	shafeeq	shafeeqsiddiq55@gmail.com	9677824619	mani,perudurai,638052	$2b$10$lCFFS.ZHsJ2F5zG5O.HyX.6K9VKjyKBzNPqSCom0qJpoxO7QE53Mq	admin	active	2026-07-27 17:30:54.583763+05:30	2026-07-27 17:30:54.583763+05:30
1	hsp	hsp@gmail.com	1234567892	rag,covai,123	$2b$10$iN1lM1xRcxWM3t1JtwLI5uNeqdsPWfQ6uDzQadU01BhggFFZJOfCS	customer	active	2026-07-20 11:10:04.730322+05:30	2026-07-20 11:10:04.730322+05:30
4	shafeeq m	shafeeqsiddiq91@gmail.com	0987654321	we,you123,coimbatore	$2b$10$U6GIwoUBZUSOwZ1cUZf.POEhtPro4mqWzo5BSV74fuQqoTtE/dRYS	customer	active	2026-08-13 14:38:28.595059+05:30	2026-08-13 14:38:28.595059+05:30
5	jhon	mohammedshafeeqm786@gmail.com	1234578641	thry,yrur,21	$2b$10$p5m9hjtrjJ.m/eHFNWznje5lIq2nNTXTQYDqGq5DFTiqpHmIQfGS6	customer	active	2026-08-24 10:53:44.106482+05:30	2026-08-24 10:53:44.106482+05:30
6	sailesh	sailesh321@gmail.com	4567890321	drf,thtfv,tgdvaq3swdetfrhyu	$2b$10$XqD./74jjxaqEO8WqxH1cO8RJhimtPAAuKS5lt5i8la0BdMX9fPTi	customer	active	2026-08-29 16:19:13.70562+05:30	2026-08-29 16:19:13.70562+05:30
7	shafeeqsf	sf@gmail.com	4567832133	jjhgfe,jgdhg,bhjefghjw	$2b$10$bXxYfeSDClTyiC8HP6ZWouVCLle/hF38fiy1lZ68OlwgUiIvyPYZy	customer	active	2026-08-30 20:34:32.194031+05:30	2026-08-30 20:34:32.194031+05:30
8	Admin User	admin@fruitshop.com	+1-555-0100	Fruit Shop HQ	$2b$10$ehcbVi14lhVnYAWI/dGQwOzygZ3S.nGNqv3kOHdy.WUVRewfyTpZe	admin	active	2026-08-30 21:20:42.446802+05:30	2026-08-30 21:20:42.446802+05:30
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, user_id, product_id, quantity, weight_option, created_at, updated_at) FROM stdin;
10	2	4	1	\N	2026-07-27 12:15:16.686198+05:30	2026-07-27 12:15:16.686198+05:30
14	5	17	1	\N	2026-08-24 10:53:56.779358+05:30	2026-08-24 10:53:56.779358+05:30
19	6	22	1	1kg	2026-08-29 16:21:58.853124+05:30	2026-08-29 16:21:58.853124+05:30
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_messages (id, name, email, subject, message, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coupons (id, code, discount_type, discount_value, min_order_amount, expires_at, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, status, delivery_address, phone, payment_method, subtotal, discount, delivery_charge, total, coupon_code, estimated_delivery, created_at, updated_at) FROM stdin;
2	2	confirmed	run,covai,65	7890564321	upi	120.00	0.00	50.00	170.00	\N	Thu Jul 30 2026	2026-07-27 09:59:47.469845+05:30	2026-07-27 17:34:46.526+05:30
1	2	confirmed	run,covai,65	7890564321	upi	300.00	0.00	50.00	350.00	\N	Thu Jul 30 2026	2026-07-27 09:26:11.516966+05:30	2026-07-28 18:00:38.73+05:30
3	6	pending	drf,thtfv,tgdvaq3swdetfrhyu	4567890321	cash_on_delivery	340.00	0.00	50.00	390.00	\N	Tue Sep 01 2026	2026-08-29 16:20:45.496362+05:30	2026-08-29 16:20:45.496362+05:30
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, quantity, price, weight_option, created_at) FROM stdin;
1	1	2	2	60.00	\N	2026-07-27 09:26:11.529799+05:30
2	1	3	2	90.00	\N	2026-07-27 09:26:11.587913+05:30
3	2	1	1	120.00	\N	2026-07-27 09:59:47.478168+05:30
4	3	19	1	340.00	1kg	2026-08-29 16:20:45.51561+05:30
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, product_id, user_id, rating, comment, created_at) FROM stdin;
\.


--
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishlist (id, user_id, product_id, created_at) FROM stdin;
7	2	1	2026-07-27 09:15:36.413633+05:30
9	2	3	2026-07-27 09:17:26.814708+05:30
10	2	4	2026-07-27 09:18:04.49061+05:30
14	5	17	2026-08-24 10:53:55.316255+05:30
15	6	22	2026-08-29 16:19:21.202518+05:30
16	6	21	2026-08-29 16:19:26.001042+05:30
\.


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 19, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 6, true);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 1, false);


--
-- Name: coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.coupons_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 4, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 3, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 106, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: wishlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.wishlist_id_seq', 16, true);


--
-- PostgreSQL database dump complete
--

\unrestrict iN1jDOob56zjlBzkhzrvQ5yLTIxSh9fipheVf8kQZRe2gLapaT74J1pTFnZdhzq

