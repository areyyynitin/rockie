import InfiniteMenu from "../src/ui/InfiniteMenu";

const items = [
  {
    image: '/drunk/1.jpg',
   
  },
   {
    image: '/drunk/2.jpg',
   
  },
   {
    image: '/drunk/3.jpg',
   
  },
   {
    image: '/drunk/4.jpg',
  },
   {
    image: '/drunk/5.jpg',
  },
   {
    image: '/drunk/6.jpeg',
  },
   {
    image: '/drunk/7.jpeg',
  },
   {
    image: '/drunk/8.jpeg',
  },
   {
    image: '/drunk/9.jpg',
  },
];

export default function LoveSection() {
  return (
    <section className="h-screen w-full" style={{ background: '#123456' }}>
      <InfiniteMenu items={items}
    scale={1}
/>
    </section>
  );
}