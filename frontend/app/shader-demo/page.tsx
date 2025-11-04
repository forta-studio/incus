import HoverEffectImage from "@/components/HoverEffectImage";

export default function ShaderDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          WebGL Shader Image Hover Effects Demo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Demo with placeholder images */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <HoverEffectImage
              src="https://picsum.photos/400/400?random=1"
              alt="Demo Image 1"
              width={400}
              height={400}
              className="w-full h-auto rounded"
            />
            <p className="mt-4 text-sm text-gray-600">
              Hover over this image to see the warp and heat effect!
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg">
            <HoverEffectImage
              src="https://picsum.photos/400/600?random=2"
              alt="Demo Image 2"
              width={400}
              height={600}
              className="w-full h-auto rounded"
            />
            <p className="mt-4 text-sm text-gray-600">
              Different aspect ratios work too!
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg">
            <HoverEffectImage
              src="https://picsum.photos/500/300?random=3"
              alt="Demo Image 3"
              width={500}
              height={300}
              className="w-full h-auto rounded"
            />
            <p className="mt-4 text-sm text-gray-600">
              Landscape format also supported!
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="max-w-2xl mx-auto text-left space-y-4">
            <p className="text-gray-700">
              <strong>Distortion Effect:</strong> The image warps slightly
              toward your cursor position using WebGL fragment shaders.
            </p>
            <p className="text-gray-700">
              <strong>Heat Effect:</strong> Highlights are brightened and warm
              tones (red/orange) are enhanced to create a subtle burn effect.
            </p>
            <p className="text-gray-700">
              <strong>Performance:</strong> Uses Three.js with WebGL for
              hardware-accelerated rendering.
            </p>
            <p className="text-gray-700">
              <strong>Reusable:</strong> Just replace your regular images with
              the HoverEffectImage component!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
