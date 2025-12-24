export default {
	async fetch(request, env) {
		// GET request - return HTML form
		if (request.method === "GET") {
			return new Response(HTML_FORM, {
				headers: { "content-type": "text/html;charset=UTF-8" }
			});
		}

		// POST request - generate image
		if (request.method === "POST") {
			try {
				const formData = await request.formData();
				const promptType = formData.get("type") || "elegant_portrait";

				// PROMPT TEMPLATES for realistic social media profile photos
				const prompts = {
					elegant_portrait: {
						prompt: "professional portrait photography of an elegant young asian woman, sophisticated beauty, flowing dark hair, warm genuine smile, designer casual wear, soft beige tones, golden hour lighting, shallow depth of field, photorealistic, high-end fashion photography style, natural skin texture, professional makeup, 8k ultra quality, Instagram worthy",
						negative_prompt: "cartoon, anime, illustration, painting, 3d render, cgi, fake, doll, mannequin, plastic, artificial, unrealistic, blurry, distorted, deformed, ugly, bad anatomy, extra limbs, text, watermark, signature, low quality"
					},
					
					fashion_casual: {
						prompt: "stunning portrait of confident young asian woman, modern fashionista, stylish outfit, trendy accessories, urban chic aesthetic, soft natural makeup, expressive eyes, captivating smile, rooftop setting, sunset glow, professional fashion photography, bokeh background, detailed facial features, flawless skin, 8k resolution, social media ready",
						negative_prompt: "cartoon, anime, drawn, painted, 3d, cgi, artificial, fake, plastic skin, doll-like, unrealistic, blurry, low quality, distorted, bad proportions, text, watermark"
					},
					
					lifestyle_influencer: {
						prompt: "lifestyle portrait of charming young asian woman, influencer aesthetic, natural beauty, minimal makeup, effortless style, cozy sweater, warm coffee tones, cafe ambiance, soft window light, candid moment, authentic expression, professional photography, Instagram aesthetic, natural skin glow, 8k quality, engaging presence",
						negative_prompt: "cartoon, anime, illustration, 3d render, fake, artificial, plastic, doll, mannequin, unrealistic, blurry, distorted, deformed, bad quality, text, watermark, signature"
					},
					
					beach_goddess: {
						prompt: "dreamy beach portrait of beautiful young asian woman, beach lifestyle, sun-kissed skin, windswept hair, white summer dress, ocean backdrop, golden hour sunlight, soft ocean breeze mood, natural radiant beauty, vacation vibes, professional travel photography, warm color grading, detailed features, 8k ultra quality, wanderlust aesthetic",
						negative_prompt: "cartoon, anime, painted, 3d, cgi, fake, plastic, artificial, doll-like, unrealistic, blurry, low quality, distorted, bad anatomy, text, watermark"
					},
					
					urban_chic: {
						prompt: "sophisticated urban portrait of stylish young asian woman, city girl aesthetic, contemporary fashion, sleek hairstyle, modern makeup, architectural background, golden hour city lights, professional street style photography, confident pose, editorial quality, sharp details, natural skin texture, 8k resolution, metropolitan vibe",
						negative_prompt: "cartoon, anime, illustration, painted, 3d render, cgi, fake, artificial, plastic skin, doll, unrealistic, blurry, distorted, low quality, text, watermark"
					},
					
					fitness_active: {
						prompt: "energetic portrait of athletic young asian woman, fitness lifestyle, active wear, healthy glow, toned physique, confident smile, outdoor gym setting, morning sunlight, motivational atmosphere, professional sports photography, dynamic composition, natural beauty, detailed skin, 8k quality, wellness aesthetic",
						negative_prompt: "cartoon, anime, drawn, 3d, cgi, fake, plastic, artificial, doll-like, unrealistic, blurry, distorted, deformed, bad anatomy, text, watermark, low quality"
					},
					
					vintage_glam: {
						prompt: "glamorous vintage portrait of elegant young asian woman, retro Hollywood style, classic beauty, timeless makeup, vintage fashion, sophisticated pose, soft studio lighting, film photography aesthetic, romantic mood, professional headshot, flawless complexion, detailed eyes, 8k ultra quality, old Hollywood charm",
						negative_prompt: "cartoon, anime, illustration, 3d render, cgi, fake, plastic, doll, mannequin, artificial, unrealistic, blurry, distorted, bad quality, text, watermark"
					},
					
					bohemian_free: {
						prompt: "ethereal bohemian portrait of free-spirited young asian woman, boho chic style, natural flowing hair, flower crown, earthy tones, outdoor nature setting, soft diffused light, dreamy atmosphere, artistic photography, authentic expression, natural beauty, detailed features, 8k resolution, carefree aesthetic",
						negative_prompt: "cartoon, anime, painted, 3d, cgi, fake, artificial, plastic, doll-like, unrealistic, blurry, low quality, distorted, deformed, text, watermark"
					},
					
					luxury_elegance: {
						prompt: "luxurious portrait of sophisticated young asian woman, high-end fashion, designer clothing, elegant jewelry, refined makeup, upscale ambiance, professional lighting, editorial photography style, confident posture, premium quality, flawless skin, sharp details, 8k ultra resolution, luxury brand aesthetic",
						negative_prompt: "cartoon, anime, illustration, 3d render, cgi, fake, plastic, doll, artificial, unrealistic, blurry, distorted, bad quality, cheap look, text, watermark"
					},
					
					natural_beauty: {
						prompt: "pure natural portrait of beautiful young asian woman, minimal makeup, authentic beauty, genuine smile, casual comfortable outfit, outdoor natural setting, soft daylight, organic mood, real moment captured, professional portrait photography, healthy skin glow, detailed facial features, 8k quality, girl-next-door charm",
						negative_prompt: "cartoon, anime, drawn, painted, 3d, cgi, fake, artificial, plastic skin, doll, mannequin, unrealistic, blurry, distorted, low quality, text, watermark"
					}
				};

				const selectedPrompt = prompts[promptType] || prompts.elegant_portrait;

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
	<title>AI Profile Photo Generator</title>
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
			max-width: 1200px;
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
			grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
			line-height: 1.4;
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
		<h1>✨ AI Profile Photo Generator</h1>
		<p class="subtitle">Choose your style for stunning social media profile photos</p>

		<div class="options-grid">
			<div class="option-card selected" onclick="selectType('elegant_portrait')">
				<div class="option-icon">👑</div>
				<div class="option-title">Elegant Portrait</div>
				<div class="option-desc">Sophisticated & classy</div>
			</div>

			<div class="option-card" onclick="selectType('fashion_casual')">
				<div class="option-icon">👗</div>
				<div class="option-title">Fashion Casual</div>
				<div class="option-desc">Trendy & stylish</div>
			</div>

			<div class="option-card" onclick="selectType('lifestyle_influencer')">
				<div class="option-icon">📸</div>
				<div class="option-title">Lifestyle Influencer</div>
				<div class="option-desc">Instagram aesthetic</div>
			</div>

			<div class="option-card" onclick="selectType('beach_goddess')">
				<div class="option-icon">🌊</div>
				<div class="option-title">Beach Goddess</div>
				<div class="option-desc">Summer vacation vibes</div>
			</div>

			<div class="option-card" onclick="selectType('urban_chic')">
				<div class="option-icon">🌆</div>
				<div class="option-title">Urban Chic</div>
				<div class="option-desc">City lifestyle</div>
			</div>

			<div class="option-card" onclick="selectType('fitness_active')">
				<div class="option-icon">💪</div>
				<div class="option-title">Fitness Active</div>
				<div class="option-desc">Healthy & energetic</div>
			</div>

			<div class="option-card" onclick="selectType('vintage_glam')">
				<div class="option-icon">🎬</div>
				<div class="option-title">Vintage Glam</div>
				<div class="option-desc">Old Hollywood style</div>
			</div>

			<div class="option-card" onclick="selectType('bohemian_free')">
				<div class="option-icon">🌸</div>
				<div class="option-title">Bohemian Free</div>
				<div class="option-desc">Natural & artistic</div>
			</div>

			<div class="option-card" onclick="selectType('luxury_elegance')">
				<div class="option-icon">💎</div>
				<div class="option-title">Luxury Elegance</div>
				<div class="option-desc">High-end & premium</div>
			</div>

			<div class="option-card" onclick="selectType('natural_beauty')">
				<div class="option-icon">🌿</div>
				<div class="option-title">Natural Beauty</div>
				<div class="option-desc">Authentic & pure</div>
			</div>
		</div>

		<button class="generate-btn" onclick="generateImage()" id="generateBtn">
			✨ Generate Photo
		</button>

		<div class="loading" id="loading">
			<div class="spinner"></div>
			<p style="color: #667eea; font-weight: 600; font-size: 18px;">Creating your photo...</p>
			<p style="color: #999; margin-top: 10px;">Please wait 10-20 seconds</p>
		</div>

		<div id="result" class="result"></div>

		<div id="gallery" class="gallery"></div>
	</div>

	<script>
		let selectedType = 'elegant_portrait';
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
			generateBtn.textContent = '⏳ Creating...';

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
						<h2 style="color: #333; margin-bottom: 20px;">✨ Your Photo is Ready!</h2>
						<p style="color: #666; margin-bottom: 20px;">Processing time: \${processingTime}s</p>
						<img src="\${imageUrl}" alt="Generated Profile Photo">
						<br><br>
						<a href="\${imageUrl}" download="profile_\${selectedType}_\${Date.now()}.png" class="download-btn">
							📥 Download Photo
						</a>
					\`;

					updateGallery();
				} else {
					result.innerHTML = \`
						<div style="color: #dc3545; padding: 20px;">
							<h2>❌ Error</h2>
							<p>\${await response.text()}</p>
						</div>
					\`;
				}
			} catch (error) {
				result.innerHTML = \`
					<div style="color: #dc3545; padding: 20px;">
						<h2>❌ Error</h2>
						<p>\${error.message}</p>
					</div>
				\`;
			} finally {
				loading.style.display = 'none';
				generateBtn.disabled = false;
				generateBtn.textContent = '✨ Generate Photo';
			}
		}

		function updateGallery() {
			const gallery = document.getElementById('gallery');
			if (generatedImages.length > 0) {
				gallery.innerHTML = '<h3 style="grid-column: 1/-1; color: #333;">Your Gallery:</h3>' +
					generatedImages.map(url => \`<img src="\${url}" onclick="viewImage('\${url}')">\`).join('');
			}
		}

		function viewImage(url) {
			const result = document.getElementById('result');
			result.innerHTML = \`
				<h2 style="color: #333; margin-bottom: 20px;">👁️ View Photo</h2>
				<img src="\${url}" alt="View">
				<br><br>
				<a href="\${url}" download="image.png" class="download-btn">
					📥 Download Photo
				</a>
			\`;
			result.scrollIntoView({ behavior: 'smooth' });
		}
	</script>
</body>
</html>`;