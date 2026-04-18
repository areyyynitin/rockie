import InfiniteMenu from "../src/ui/InfiniteMenu";

const items = [
  {
    image: '/rock/1.jpeg',
  },
    {
    image: '/rock/2.jpeg',
  },
    {
    image: '/rock/3.jpeg',
  },
    {
    image: '/rock/4.jpeg',
  },
    {
    image: '/rock/5.jpeg',
  },
    {
    image: '/rock/6.jpeg',
  },
    {
    image: '/rock/7.jpeg',
  },
    {
    image: '/rock/8.jpeg',
  },
    {
    image: '/rock/9.jpeg',
  },
    {
    image: '/rock/10.jpeg',
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