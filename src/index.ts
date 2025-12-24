export default {
	async fetch(request, env) {
		const inputs = {
			prompt: "beautiful woman portrait, highly detailed, sharp focus, professional photography, studio lighting, 8k uhd, photorealistic, elegant, sophisticated, perfect face, flawless skin, trending on artstation",
			negative_prompt: "blurry, low quality, distorted, disfigured, ugly, bad anatomy, bad proportions, watermark, text, signature",
			num_steps: 30, // Tăng steps để ảnh nét hơn (mặc định 20)
			guidance: 7.5, // Điều chỉnh độ tuân thủ prompt
		};
		
		const response = await env.AI.run(
			"@cf/stabilityai/stable-diffusion-xl-base-1.0",
			inputs,
		);
		
		return new Response(response, {
			headers: {
				"content-type": "image/png",
			},
		});
	},
} satisfies ExportedHandler<Env>;