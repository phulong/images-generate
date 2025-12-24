export default {
	async fetch(request, env) {
		const inputs = {
			prompt: "beautiful woman portrait, highly detailed, sharp focus, professional photography, studio lighting, 8k uhd, photorealistic, elegant, sophisticated, perfect face, flawless skin, trending on artstation",
			negative_prompt: "blurry, low quality, distorted, disfigured, ugly, bad anatomy, bad proportions, watermark, text, signature, deformed",
			num_steps: 20, // Tối đa 20 trên CF Workers
			guidance: 7.5,
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