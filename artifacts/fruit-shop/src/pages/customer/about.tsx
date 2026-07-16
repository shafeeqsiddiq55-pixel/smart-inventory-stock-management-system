import { CustomerLayout } from '@/components/layout/customer-layout';
import aboutFarmImg from '@assets/generated_images/about-farm.jpg';

export default function AboutPage() {
  return (
    <CustomerLayout>
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={aboutFarmImg} alt="Our Organic Farm" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Our Story</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">From our family orchards directly to your table.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <h2 className="font-serif text-3xl text-foreground text-center mb-8">Rooted in Nature, Grown with Care</h2>
          
          <p className="text-muted-foreground leading-relaxed text-center mb-12">
            Founded in 2010, Natura began with a simple mission: to make premium, farm-fresh produce accessible to everyone. What started as a small family orchard has grown into a collective of passionate farmers dedicated to sustainable agriculture and uncompromising quality.
          </p>

          <div className="grid sm:grid-cols-2 gap-12 my-16">
            <div className="bg-muted/30 p-8 rounded-2xl border">
              <h3 className="font-serif text-xl font-bold mb-4">Our Promise</h3>
              <p className="text-muted-foreground">
                We believe that good food shouldn't be complicated. Our promise is to deliver fruits that look beautiful, taste extraordinary, and are grown using methods that respect our planet.
              </p>
            </div>
            <div className="bg-muted/30 p-8 rounded-2xl border">
              <h3 className="font-serif text-xl font-bold mb-4">Sustainability</h3>
              <p className="text-muted-foreground">
                We employ water-saving irrigation, organic pest management, and zero-waste packaging wherever possible. Taking care of the earth is just as important to us as taking care of our customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
