export default {
	async fetch(request, env) {
		// GET request - trả về HTML form
		if (request.method === "GET") {
			return new Response(HTML_FORM, {
				headers: { "content-type": "text/html;charset=UTF-8" }
			});
		}

		// POST request - generate image
		if (request.method === "POST") {
			try {
				const formData = await request.formData();
				const promptType = formData.get("type") || "woman";

				// PROMPT TEMPLATES cho ảnh người thật
				const prompts = {
					woman: {
						prompt: "photo portrait of a beautiful young asian woman, natural beauty, black hair, brown eyes, friendly smile, casual outfit, outdoor cafe setting, natural daylight, soft lighting, photorealistic, real person, candid photography, authentic, lifelike, detailed face, natural skin, professional photo, 8k, high quality",
						negative_prompt: "cartoon, anime, illustration, painting, 3d render, cgi, fake, doll, mannequin, plastic, artificial, unrealistic, blurry, distorted, deformed, ugly, bad anatomy, extra limbs, text, watermark, signature"
					},
					man: {
						prompt: "photo portrait of a handsome young asian man, natural look, short black hair, confident expression, casual shirt, outdoor setting, natural daylight, soft lighting, photorealistic, real person, candid photography, authentic, lifelike, detailed face, natural skin, professional photo, 8k, high quality",
						negative_prompt: "cartoon, anime, illustration, painting, 3d render, cgi, fake, doll, mannequin, plastic, artificial, unrealistic, blurry, distorted, deformed, ugly, bad anatomy, extra limbs, text, watermark, signature"
					},
					professional_woman: {
						prompt: "professional headshot photo of asian businesswoman, elegant appearance, professional attire, natural makeup, confident smile, studio lighting, white background, corporate portrait, photorealistic, real person, detailed facial features, natural skin texture, high quality photography, 8k resolution",
						negative_prompt: "cartoon, anime, illustration, 3d, cgi, fake, plastic, doll, unrealistic, blurry, distorted, deformed, bad quality, text, watermark"
					},
					professional_man: {
						prompt: "professional headshot photo of asian businessman, clean appearance, business suit, confident expression, studio lighting, white background, corporate portrait, photorealistic, real person, detailed facial features, natural skin texture, high quality photography, 8k resolution",
						negative_prompt: "cartoon, anime, illustration, 3d, cgi, fake, plastic, doll, unrealistic, blurry, distorted, deformed, bad quality, text, watermark"
					},
					casual_woman: {
						prompt: "casual photo of young asian woman, natural beauty, long dark hair, genuine smile, coffee shop background, morning light through window, wearing casual clothes, photorealistic, authentic moment, real person photograph, natural expression, soft focus background, professional photography, 8k quality",
						negative_prompt: "cartoon, anime, drawn, painted, 3d render, artificial, fake, doll-like, plastic skin, unrealistic, blurry, low quality, distorted, deformed, text, watermark"
					},
					casual_man: {
						prompt: "casual photo of young asian man, natural appearance, styled hair, relaxed smile, urban cafe background, natural window lighting, wearing casual shirt, photorealistic, authentic moment, real person photograph, natural expression, soft focus background, professional photography, 8k quality",
						negative_prompt: "cartoon, anime, drawn, painted, 3d render, artificial, fake, doll-like, plastic skin, unrealistic, blurry, low quality, distorted, deformed, text, watermark"
					}
				};

				const selectedPrompt = prompts[promptType] || prompts.woman;

				const inputs = {
					prompt: selectedPrompt.prompt,
					negative_prompt: selectedPrompt.negative_prompt,
					num_steps: 20,
					guidance: 7.5,
				};

				const response = await env.AI.run(
					"@cf/stabilityai/stable-diffusion-xl-base-1.0",
					inputs
				);

				return new Response(response, {
					headers: {
						"content-type": "image/png",
						"Cache-Control": "no-cache",
					},
				});

			} catch (error) {
				return new Response(`Error: ${error.message}`, { status: 500 });
			}
		}

		return new Response("Method not allowed", { status: 405 });
	},
} satisfies ExportedHandler<Env>;

const HTML_FORM = `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Tạo Ảnh Người Thật</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			min-height: 100vh;
			padding: 20px;
		}
		.container {
			max-width: 1000px;
			margin: 0 auto;
			background: white;
			border-radius: 20px;
			padding: 40px;
			box-shadow: 0 20px 60px rgba(0,0,0,0.3);
		}
		h1 {
			text-align: center;
			color: #333;
			margin-bottom: 15px;
			font-size: 32px;
		}
		.subtitle {
			text-align: center;
			color: #666;
			margin-bottom: 40px;
		}
		.options-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 20px;
			margin-bottom: 30px;
		}
		.option-card {
			background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
			border: 3px solid transparent;
			border-radius: 15px;
			padding: 25px;
			cursor: pointer;
			transition: all 0.3s;
			text-align: center;
		}
		.option-card:hover {
			transform: translateY(-5px);
			box-shadow: 0 10px 30px rgba(0,0,0,0.15);
		}
		.option-card.selected {
			border-color: #667eea;
			background: linear-gradient(135deg, #e8ecff 0%, #d5dcff 100%);
			box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
		}
		.option-icon {
			font-size: 50px;
			margin-bottom: 15px;
		}
		.option-title {
			font-size: 16px;
			font-weight: 700;
			color: #333;
			margin-bottom: 8px;
		}
		.option-desc {
			font-size: 12px;
			color: #666;
		}
		.generate-btn {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			border: none;
			padding: 20px 50px;
			border-radius: 12px;
			font-size: 20px;
			font-weight: 700;
			cursor: pointer;
			width: 100%;
			transition: all 0.3s;
		}
		.generate-btn:hover {
			transform: scale(1.02);
			box-shadow: 0 10px 40px rgba(102, 126, 234, 0.5);
		}
		.generate-btn:disabled {
			background: #ccc;
			cursor: not-allowed;
		}
		.loading {
			display: none;
			text-align: center;
			margin: 40px 0;
		}
		.spinner {
			width: 60px;
			height: 60px;
			border: 5px solid #f3f3f3;
			border-top: 5px solid #667eea;
			border-radius: 50%;
			animation: spin 1s linear infinite;
			margin: 0 auto 20px;
		}
		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
		.result {
			margin-top: 40px;
			text-align: center;
		}
		.result img {
			max-width: 100%;
			border-radius: 15px;
			box-shadow: 0 15px 50px rgba(0,0,0,0.3);
			margin-bottom: 20px;
		}
		.download-btn {
			display: inline-block;
			padding: 15px 40px;
			background: #28a745;
			color: white;
			text-decoration: none;
			border-radius: 10px;
			font-weight: 600;
			transition: all 0.3s;
		}
		.download-btn:hover {
			background: #218838;
			transform: translateY(-2px);
		}
		.gallery {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 15px;
			margin-top: 20px;
		}
		.gallery img {
			width: 100%;
			border-radius: 10px;
			cursor: pointer;
			transition: transform 0.3s;
		}
		.gallery img:hover {
			transform: scale(1.05);
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>📸 Tạo Ảnh Người Thật</h1>
		<p class="subtitle">Chọn kiểu ảnh bạn muốn tạo</p>

		<div class="options-grid">
			<div class="option-card selected" onclick="selectType('woman')">
				<div class="option-icon">👩</div>
				<div class="option-title">Phụ Nữ Casual</div>
				<div class="option-desc">Tự nhiên, thân thiện</div>
			</div>

			<div class="option-card" onclick="selectType('man')">
				<div class="option-icon">👨</div>
				<div class="option-title">Nam Giới Casual</div>
				<div class="option-desc">Thoải mái, năng động</div>
			</div>

			<div class="option-card" onclick="selectType('professional_woman')">
				<div class="option-icon">👩‍💼</div>
				<div class="option-title">Phụ Nữ Chuyên Nghiệp</div>
				<div class="option-desc">Văn phòng, lịch sự</div>
			</div>

			<div class="option-card" onclick="selectType('professional_man')">
				<div class="option-icon">👨‍💼</div>
				<div class="option-title">Nam Giới Chuyên Nghiệp</div>
				<div class="option-desc">Công sở, nghiêm túc</div>
			</div>

			<div class="option-card" onclick="selectType('casual_woman')">
				<div class="option-icon">☕</div>
				<div class="option-title">Cafe Portrait (Nữ)</div>
				<div class="option-desc">Quán cafe, ánh sáng tự nhiên</div>
			</div>

			<div class="option-card" onclick="selectType('casual_man')">
				<div class="option-icon">☕</div>
				<div class="option-title">Cafe Portrait (Nam)</div>
				<div class="option-desc">Quán cafe, thoải mái</div>
			</div>
		</div>

		<button class="generate-btn" onclick="generateImage()" id="generateBtn">
			✨ Tạo Ảnh
		</button>

		<div class="loading" id="loading">
			<div class="spinner"></div>
			<p style="color: #667eea; font-weight: 600; font-size: 18px;">Đang tạo ảnh...</p>
			<p style="color: #999; margin-top: 10px;">Vui lòng đợi 10-20 giây</p>
		</div>

		<div id="result" class="result"></div>

		<div id="gallery" class="gallery"></div>
	</div>

	<script>
		let selectedType = 'woman';
		let generatedImages = [];

		function selectType(type) {
			selectedType = type;
			document.querySelectorAll('.option-card').forEach(card => {
				card.classList.remove('selected');
			});
			event.currentTarget.classList.add('selected');
		}

		async function generateImage() {
			const loading = document.getElementById('loading');
			const result = document.getElementById('result');
			const generateBtn = document.getElementById('generateBtn');

			loading.style.display = 'block';
			result.innerHTML = '';
			generateBtn.disabled = true;
			generateBtn.textContent = '⏳ Đang tạo...';

			const formData = new FormData();
			formData.append('type', selectedType);

			try {
				const startTime = Date.now();
				const response = await fetch('/', {
					method: 'POST',
					body: formData
				});

				const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);

				if (response.ok) {
					const blob = await response.blob();
					const imageUrl = URL.createObjectURL(blob);
					
					generatedImages.unshift(imageUrl);
					
					result.innerHTML = \`
						<h2 style="color: #333; margin-bottom: 20px;">✨ Ảnh Đã Tạo</h2>
						<p style="color: #666; margin-bottom: 20px;">Thời gian: \${processingTime}s</p>
						<img src="\${imageUrl}" alt="Generated">
						<br><br>
						<a href="\${imageUrl}" download="person_\${selectedType}_\${Date.now()}.png" class="download-btn">
							📥 Tải Xuống
						</a>
					\`;

					updateGallery();
				} else {
					result.innerHTML = \`
						<div style="color: #dc3545; padding: 20px;">
							<h2>❌ Lỗi</h2>
							<p>\${await response.text()}</p>
						</div>
					\`;
				}
			} catch (error) {
				result.innerHTML = \`
					<div style="color: #dc3545; padding: 20px;">
						<h2>❌ Lỗi</h2>
						<p>\${error.message}</p>
					</div>
				\`;
			} finally {
				loading.style.display = 'none';
				generateBtn.disabled = false;
				generateBtn.textContent = '✨ Tạo Ảnh';
			}
		}

		function updateGallery() {
			const gallery = document.getElementById('gallery');
			if (generatedImages.length > 0) {
				gallery.innerHTML = '<h3 style="grid-column: 1/-1; color: #333;">Ảnh đã tạo:</h3>' +
					generatedImages.map(url => \`<img src="\${url}" onclick="viewImage('\${url}')">\`).join('');
			}
		}

		function viewImage(url) {
			const result = document.getElementById('result');
			result.innerHTML = \`
				<h2 style="color: #333; margin-bottom: 20px;">👁️ Xem Ảnh</h2>
				<img src="\${url}" alt="View">
				<br><br>
				<a href="\${url}" download="image.png" class="download-btn">
					📥 Tải Xuống
				</a>
			\`;
			result.scrollIntoView({ behavior: 'smooth' });
		}
	</script>
</body>
</html>`;