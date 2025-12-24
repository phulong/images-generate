export default {
	async fetch(request, env) {
		// GET request - return HTML form
		if (request.method === "GET") {
			return new Response(HTML_FORM, {
				headers: { "content-type": "text/html;charset=UTF-8" }
			});
		}

		// POST request - process image-to-image
		if (request.method === "POST") {
			try {
				const formData = await request.formData();
				const imageFile = formData.get("image");
				const styleType = formData.get("style") || "natural_enhance";

				if (!imageFile) {
					return new Response("No image uploaded", { status: 400 });
				}

				// Convert uploaded image to array buffer
				const imageBuffer = await imageFile.arrayBuffer();
				const imageArray = Array.from(new Uint8Array(imageBuffer));

				// IMPROVED PROMPTS - More natural and realistic
				const styles = {
					natural_enhance: {
						prompt: "professional portrait photo, natural lighting, real person, photorealistic, detailed facial features, natural skin texture, authentic, high quality photography, realistic, lifelike",
						negative_prompt: "cartoon, anime, illustration, painting, 3d render, cgi, fake, doll, mannequin, plastic face, artificial, unrealistic skin, synthetic, overly smooth, blurry, distorted, deformed, ugly, bad anatomy, extra limbs, mutation, horror",
						strength: 0.35
					},
					
					soft_portrait: {
						prompt: "soft natural portrait photography, real person, gentle lighting, authentic beauty, photorealistic, natural skin, real facial features, professional photo, candid style, lifelike, high quality",
						negative_prompt: "cartoon, anime, drawn, painted, 3d, cgi, fake, plastic skin, doll-like, artificial, unrealistic, overly edited, blurry, distorted, deformed, bad proportions, mutation",
						strength: 0.4
					},
					
					studio_lighting: {
						prompt: "professional studio portrait, real person photo, natural makeup, soft lighting setup, authentic features, photorealistic, natural skin texture, real photography, high quality, lifelike appearance",
						negative_prompt: "cartoon, anime, illustration, 3d render, cgi, fake, plastic, doll face, mannequin, artificial, unrealistic, synthetic skin, overly smooth, blurry, distorted, deformed, bad anatomy",
						strength: 0.38
					},
					
					golden_hour: {
						prompt: "natural golden hour portrait, real person outdoors, warm sunlight, authentic beauty, photorealistic, natural skin, real facial details, professional outdoor photography, lifelike, genuine expression",
						negative_prompt: "cartoon, anime, painted, 3d, cgi, fake, artificial, plastic skin, doll-like, unrealistic, synthetic, overly edited, blurry, distorted, deformed, bad quality, mutation",
						strength: 0.42
					},
					
					casual_outdoor: {
						prompt: "casual outdoor portrait photo, real person, natural daylight, authentic look, photorealistic, natural skin texture, real features, candid photography style, lifelike, professional quality",
						negative_prompt: "cartoon, anime, illustration, 3d render, cgi, fake, plastic face, doll, mannequin, artificial skin, unrealistic, overly processed, blurry, distorted, deformed, bad anatomy",
						strength: 0.4
					},
					
					soft_beauty: {
						prompt: "soft beauty portrait, real person photograph, gentle natural light, authentic features, photorealistic skin, natural makeup, real facial details, professional portrait, lifelike, high quality photo",
						negative_prompt: "cartoon, anime, drawn, painted, 3d, cgi, fake, plastic, doll-like, artificial, unrealistic skin, synthetic, overly smooth, blurry, distorted, deformed, mutation, bad proportions",
						strength: 0.36
					},
					
					natural_light: {
						prompt: "natural window light portrait, real person photo, soft diffused lighting, authentic beauty, photorealistic, natural skin, real features, professional indoor photography, lifelike, genuine",
						negative_prompt: "cartoon, anime, illustration, 3d render, cgi, fake, artificial, plastic skin, doll face, mannequin, unrealistic, synthetic, overly edited, blurry, distorted, deformed, bad quality",
						strength: 0.38
					},
					
					warm_tones: {
						prompt: "warm tone portrait photography, real person, natural color grading, authentic look, photorealistic, natural skin texture, real facial features, professional photo, lifelike, high quality",
						negative_prompt: "cartoon, anime, painted, 3d, cgi, fake, plastic, doll-like, artificial skin, unrealistic, synthetic, overly processed, blurry, distorted, deformed, bad anatomy, mutation",
						strength: 0.4
					},
					
					fresh_outdoor: {
						prompt: "fresh outdoor portrait, real person photograph, natural environment, authentic appearance, photorealistic, natural skin, real details, professional outdoor photo, lifelike, genuine expression",
						negative_prompt: "cartoon, anime, illustration, 3d render, cgi, fake, artificial, plastic face, doll, mannequin, unrealistic skin, synthetic, overly smooth, blurry, distorted, deformed, bad quality",
						strength: 0.42
					},
					
					clean_portrait: {
						prompt: "clean professional portrait, real person photo, balanced lighting, authentic features, photorealistic, natural skin texture, real facial details, high quality photography, lifelike, professional",
						negative_prompt: "cartoon, anime, drawn, painted, 3d, cgi, fake, plastic skin, doll-like, artificial, unrealistic, synthetic, overly edited, blurry, distorted, deformed, bad anatomy, mutation, horror",
						strength: 0.35
					}
				};

				const selectedStyle = styles[styleType] || styles.natural_enhance;

				const inputs = {
					prompt: selectedStyle.prompt,
					negative_prompt: selectedStyle.negative_prompt,
					image: imageArray,
					strength: selectedStyle.strength,
					num_steps: 20,
					guidance: 6.5,
				};

				const response = await env.AI.run(
					"@cf/runwayml/stable-diffusion-v1-5-img2img",
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
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>AI Natural Photo Enhancer</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			min-height: 100vh;
			padding: 20px;
		}
		.container {
			max-width: 1400px;
			margin: 0 auto;
			background: white;
			border-radius: 20px;
			padding: 40px;
			box-shadow: 0 20px 60px rgba(0,0,0,0.3);
		}
		h1 {
			text-align: center;
			color: #333;
			margin-bottom: 10px;
			font-size: 36px;
		}
		.subtitle {
			text-align: center;
			color: #666;
			margin-bottom: 40px;
			font-size: 16px;
		}
		
		/* Upload Section */
		.upload-section {
			background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
			border-radius: 15px;
			padding: 40px;
			margin-bottom: 40px;
			text-align: center;
		}
		.upload-area {
			border: 3px dashed #667eea;
			border-radius: 15px;
			padding: 60px 20px;
			background: white;
			cursor: pointer;
			transition: all 0.3s;
		}
		.upload-area:hover {
			border-color: #764ba2;
			background: #f8f9ff;
			transform: scale(1.02);
		}
		.upload-area.dragover {
			border-color: #764ba2;
			background: #e8ecff;
		}
		.upload-icon {
			font-size: 80px;
			margin-bottom: 20px;
		}
		.upload-text {
			font-size: 20px;
			color: #333;
			font-weight: 600;
			margin-bottom: 10px;
		}
		.upload-hint {
			color: #999;
			font-size: 14px;
		}
		#fileInput {
			display: none;
		}
		
		/* Preview Section */
		.preview-section {
			display: none;
			margin-bottom: 40px;
		}
		.preview-container {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 30px;
			margin-bottom: 30px;
		}
		.preview-box {
			background: #f8f9fa;
			border-radius: 15px;
			padding: 20px;
			text-align: center;
		}
		.preview-label {
			font-size: 18px;
			font-weight: 700;
			color: #333;
			margin-bottom: 15px;
		}
		.preview-box img {
			max-width: 100%;
			max-height: 500px;
			border-radius: 10px;
			box-shadow: 0 10px 30px rgba(0,0,0,0.2);
		}
		
		/* Style Selection */
		.style-section {
			margin-bottom: 30px;
		}
		.style-title {
			font-size: 24px;
			font-weight: 700;
			color: #333;
			margin-bottom: 20px;
			text-align: center;
		}
		.styles-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 15px;
			margin-bottom: 30px;
		}
		.style-card {
			background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
			border: 3px solid transparent;
			border-radius: 12px;
			padding: 20px;
			cursor: pointer;
			transition: all 0.3s;
			text-align: center;
		}
		.style-card:hover {
			transform: translateY(-5px);
			box-shadow: 0 10px 25px rgba(0,0,0,0.15);
		}
		.style-card.selected {
			border-color: #667eea;
			background: linear-gradient(135deg, #e8ecff 0%, #d5dcff 100%);
			box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
		}
		.style-icon {
			font-size: 40px;
			margin-bottom: 10px;
		}
		.style-name {
			font-size: 14px;
			font-weight: 700;
			color: #333;
			margin-bottom: 5px;
		}
		.style-desc {
			font-size: 11px;
			color: #666;
		}
		
		/* Buttons */
		.btn-group {
			display: flex;
			gap: 15px;
			margin-bottom: 20px;
		}
		.btn {
			flex: 1;
			padding: 18px;
			border: none;
			border-radius: 12px;
			font-size: 18px;
			font-weight: 700;
			cursor: pointer;
			transition: all 0.3s;
		}
		.btn-primary {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
		}
		.btn-primary:hover:not(:disabled) {
			transform: scale(1.02);
			box-shadow: 0 10px 40px rgba(102, 126, 234, 0.5);
		}
		.btn-primary:disabled {
			background: #ccc;
			cursor: not-allowed;
		}
		.btn-secondary {
			background: #6c757d;
			color: white;
		}
		.btn-secondary:hover {
			background: #5a6268;
		}
		
		/* Loading */
		.loading {
			display: none;
			text-align: center;
			padding: 40px;
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
		.loading-text {
			color: #667eea;
			font-weight: 600;
			font-size: 18px;
		}
		
		/* Gallery */
		.gallery {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 20px;
			margin-top: 30px;
		}
		.gallery-item {
			position: relative;
			border-radius: 10px;
			overflow: hidden;
			cursor: pointer;
			transition: transform 0.3s;
			box-shadow: 0 5px 15px rgba(0,0,0,0.1);
		}
		.gallery-item:hover {
			transform: scale(1.05);
			box-shadow: 0 10px 30px rgba(0,0,0,0.2);
		}
		.gallery-item img {
			width: 100%;
			display: block;
		}
		.gallery-label {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0,0,0,0.7);
			color: white;
			padding: 10px;
			font-size: 12px;
			text-align: center;
		}
		
		/* Download Button */
		.download-btn {
			display: inline-block;
			padding: 15px 40px;
			background: #28a745;
			color: white;
			text-decoration: none;
			border-radius: 10px;
			font-weight: 600;
			transition: all 0.3s;
			margin-top: 20px;
		}
		.download-btn:hover {
			background: #218838;
			transform: translateY(-2px);
		}
		
		.info-box {
			background: #fff3cd;
			border: 2px solid #ffc107;
			border-radius: 10px;
			padding: 15px;
			margin-bottom: 30px;
			text-align: center;
		}
		.info-box strong {
			color: #856404;
		}
		
		@media (max-width: 768px) {
			.preview-container {
				grid-template-columns: 1fr;
			}
			.btn-group {
				flex-direction: column;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>📸 AI Natural Photo Enhancer</h1>
		<p class="subtitle">Upload your photo and enhance it naturally - keeping your real facial features</p>

		<!-- Upload Section -->
		<div class="upload-section">
			<div class="upload-area" id="uploadArea" onclick="document.getElementById('fileInput').click()">
				<div class="upload-icon">📤</div>
				<div class="upload-text">Click to Upload Your Photo</div>
				<div class="upload-hint">or drag and drop your image here</div>
				<div class="upload-hint" style="margin-top: 10px;">Supports: JPG, PNG, WebP (Max 5MB)</div>
			</div>
			<input type="file" id="fileInput" accept="image/*" onchange="handleFileSelect(event)">
		</div>

		<!-- Preview Section -->
		<div class="preview-section" id="previewSection">
			<div class="info-box">
				<strong>💡 Tip:</strong> These styles enhance your photo naturally while preserving your facial features and natural look
			</div>

			<div class="preview-container">
				<div class="preview-box">
					<div class="preview-label">📷 Original Photo</div>
					<img id="originalImage" src="" alt="Original">
				</div>
				<div class="preview-box">
					<div class="preview-label">✨ Enhanced Result</div>
					<img id="resultImage" src="" alt="Result" style="display: none;">
					<div id="resultPlaceholder" style="padding: 100px 20px; color: #999;">
						Select a natural enhancement style below and click "Enhance Photo"
					</div>
				</div>
			</div>

			<!-- Style Selection -->
			<div class="style-section">
				<div class="style-title">🎨 Choose Natural Enhancement Style</div>
				<div class="styles-grid">
					<div class="style-card selected" onclick="selectStyle('natural_enhance')">
						<div class="style-icon">✨</div>
						<div class="style-name">Natural Enhance</div>
						<div class="style-desc">Subtle improvement</div>
					</div>
					<div class="style-card" onclick="selectStyle('soft_portrait')">
						<div class="style-icon">🌸</div>
						<div class="style-name">Soft Portrait</div>
						<div class="style-desc">Gentle & natural</div>
					</div>
					<div class="style-card" onclick="selectStyle('studio_lighting')">
						<div class="style-icon">💡</div>
						<div class="style-name">Studio Lighting</div>
						<div class="style-desc">Professional light</div>
					</div>
					<div class="style-card" onclick="selectStyle('golden_hour')">
						<div class="style-icon">🌅</div>
						<div class="style-name">Golden Hour</div>
						<div class="style-desc">Warm sunlight</div>
					</div>
					<div class="style-card" onclick="selectStyle('casual_outdoor')">
						<div class="style-icon">🏞️</div>
						<div class="style-name">Casual Outdoor</div>
						<div class="style-desc">Natural daylight</div>
					</div>
					<div class="style-card" onclick="selectStyle('soft_beauty')">
						<div class="style-icon">🌺</div>
						<div class="style-name">Soft Beauty</div>
						<div class="style-desc">Gentle enhancement</div>
					</div>
					<div class="style-card" onclick="selectStyle('natural_light')">
						<div class="style-icon">🪟</div>
						<div class="style-name">Natural Light</div>
						<div class="style-desc">Window lighting</div>
					</div>
					<div class="style-card" onclick="selectStyle('warm_tones')">
						<div class="style-icon">🧡</div>
						<div class="style-name">Warm Tones</div>
						<div class="style-desc">Cozy atmosphere</div>
					</div>
					<div class="style-card" onclick="selectStyle('fresh_outdoor')">
						<div class="style-icon">🌿</div>
						<div class="style-name">Fresh Outdoor</div>
						<div class="style-desc">Natural environment</div>
					</div>
					<div class="style-card" onclick="selectStyle('clean_portrait')">
						<div class="style-icon">📸</div>
						<div class="style-name">Clean Portrait</div>
						<div class="style-desc">Balanced & clear</div>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="btn-group">
				<button class="btn btn-primary" id="transformBtn" onclick="transformImage()">
					✨ Enhance Photo Naturally
				</button>
				<button class="btn btn-secondary" onclick="resetUpload()">
					🔄 Upload Different Photo
				</button>
			</div>
		</div>

		<!-- Loading -->
		<div class="loading" id="loading">
			<div class="spinner"></div>
			<div class="loading-text">Enhancing your photo naturally...</div>
			<div style="color: #999; margin-top: 10px;">Preserving your facial features | Please wait 15-30 seconds</div>
		</div>

		<!-- Gallery -->
		<div id="gallery" class="gallery"></div>
	</div>

	<script>
		let uploadedFile = null;
		let selectedStyle = 'natural_enhance';
		let galleryImages = [];

		const uploadArea = document.getElementById('uploadArea');
		const fileInput = document.getElementById('fileInput');

		// Drag and drop handlers
		uploadArea.addEventListener('dragover', (e) => {
			e.preventDefault();
			uploadArea.classList.add('dragover');
		});

		uploadArea.addEventListener('dragleave', () => {
			uploadArea.classList.remove('dragover');
		});

		uploadArea.addEventListener('drop', (e) => {
			e.preventDefault();
			uploadArea.classList.remove('dragover');
			const files = e.dataTransfer.files;
			if (files.length > 0) {
				handleFile(files[0]);
			}
		});

		function handleFileSelect(event) {
			const file = event.target.files[0];
			if (file) {
				handleFile(file);
			}
		}

		function handleFile(file) {
			// Validate file
			if (!file.type.startsWith('image/')) {
				alert('Please upload an image file');
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				alert('File size must be less than 5MB');
				return;
			}

			uploadedFile = file;

			// Show preview
			const reader = new FileReader();
			reader.onload = (e) => {
				document.getElementById('originalImage').src = e.target.result;
				document.getElementById('previewSection').style.display = 'block';
				document.querySelector('.upload-section').style.display = 'none';
			};
			reader.readAsDataURL(file);
		}

		function selectStyle(style) {
			selectedStyle = style;
			document.querySelectorAll('.style-card').forEach(card => {
				card.classList.remove('selected');
			});
			event.currentTarget.classList.add('selected');
		}

		async function transformImage() {
			if (!uploadedFile) {
				alert('Please upload an image first');
				return;
			}

			const loading = document.getElementById('loading');
			const transformBtn = document.getElementById('transformBtn');
			const resultImage = document.getElementById('resultImage');
			const resultPlaceholder = document.getElementById('resultPlaceholder');

			loading.style.display = 'block';
			transformBtn.disabled = true;
			resultImage.style.display = 'none';
			resultPlaceholder.style.display = 'block';

			const formData = new FormData();
			formData.append('image', uploadedFile);
			formData.append('style', selectedStyle);

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

					resultImage.src = imageUrl;
					resultImage.style.display = 'block';
					resultPlaceholder.style.display = 'none';

					// Add to gallery
					galleryImages.unshift({
						url: imageUrl,
						style: selectedStyle,
						time: processingTime
					});
					updateGallery();

					// Show download button
					const downloadSection = document.createElement('div');
					downloadSection.style.textAlign = 'center';
					downloadSection.innerHTML = \`
						<a href="\${imageUrl}" download="enhanced_\${selectedStyle}_\${Date.now()}.png" class="download-btn">
							📥 Download Enhanced Photo
						</a>
					\`;
					resultPlaceholder.innerHTML = '';
					resultPlaceholder.appendChild(downloadSection);
					resultPlaceholder.style.display = 'block';

				} else {
					alert('Error: ' + await response.text());
				}
			} catch (error) {
				alert('Error: ' + error.message);
			} finally {
				loading.style.display = 'none';
				transformBtn.disabled = false;
			}
		}

		function updateGallery() {
			const gallery = document.getElementById('gallery');
			if (galleryImages.length > 0) {
				gallery.innerHTML = '<h3 style="grid-column: 1/-1; color: #333; text-align: center; margin-bottom: 10px;">📁 Your Enhanced Photos</h3>' +
					galleryImages.map(img => \`
					<div class="gallery-item" onclick="viewGalleryImage('\${img.url}')">
						<img src="\${img.url}" alt="\${img.style}">
						<div class="gallery-label">\${img.style.replace(/_/g, ' ')} (\${img.time}s)</div>
					</div>
				\`).join('');
			}
		}

		function viewGalleryImage(url) {
			document.getElementById('resultImage').src = url;
			document.getElementById('resultImage').style.display = 'block';
			document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth' });
		}

		function resetUpload() {
			uploadedFile = null;
			document.getElementById('previewSection').style.display = 'none';
			document.querySelector('.upload-section').style.display = 'block';
			document.getElementById('fileInput').value = '';
			document.getElementById('resultImage').style.display = 'none';
			document.getElementById('resultPlaceholder').innerHTML = 'Select a natural enhancement style below and click "Enhance Photo"';
			document.getElementById('resultPlaceholder').style.display = 'block';
		}
	</script>
</body>
</html>`;