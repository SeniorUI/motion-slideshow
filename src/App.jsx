import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid/index.js";
import {
  clamp,
  motion,
  useDragControls,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  wrap,
} from "framer-motion";
import { useMeasure } from "@uidotdev/usehooks";
import { useEffect } from "react";

import slide1 from "./assets/slide1.webp";
import slide2 from "./assets/slide2.webp";
import slide3 from "./assets/slide3.webp";
import slide4 from "./assets/slide4.webp";

const slides = [
  slide1,
  slide2,
  slide3,
  slide4,
  slide1,
  slide2,
  slide3,
  slide4,
  slide1,
  slide2,
  slide3,
  slide4,
];

const snap = (value, snapValue) => {
  return Math.round(value / snapValue) * snapValue;
};

export default function App() {
  const [containerRef, { width }] = useMeasure();

  const minOffset = -width * 4;
  const maxOffset = minOffset * 2;

  const scrollTo = useMotionValue(minOffset);
  const animationTo = useSpring(scrollTo, {
    mass: 1,
    stiffness: 100,
    damping: 25,
  });

  const dragX = useTransform(animationTo, (value) => value);
  const dragControls = useDragControls();

  const translateX = useTransform(animationTo, (value) =>
    wrap(minOffset, maxOffset, value),
  );

  useEffect(() => {
    scrollTo.jump(minOffset);
    animationTo.jump(minOffset);
    dragX.jump(minOffset);
  }, [width]);

  const handleShiftLeft = () => {
    scrollTo.set(scrollTo.get() + width);
  };

  const handleShiftRight = () => {
    scrollTo.set(scrollTo.get() - width);
  };

  const handleDragOnPointerDown = (event) => {
    dragControls.start(event);
  };

  const handleDrag = () => {
    scrollTo.jump(dragX.get());
    animationTo.jump(dragX.get());
  };

  const handleDragEnd = (_, { velocity }) => {
    scrollTo.set(
      snap(scrollTo.get() + clamp(-width / 2, width / 2, velocity.x), width),
    );
  };

  return (
    <div className="flex h-screen items-center justify-center overflow-x-hidden font-text">
      <motion.main
        whileHover={{ cursor: "grab" }}
        whileTap={{ cursor: "grabbing" }}
        onPointerDown={handleDragOnPointerDown}
        className="relative flex w-full select-none justify-center"
      >
        <div className="absolute -top-10 left-0 z-50 -skew-x-12 text-7xl font-bold uppercase tracking-tight mix-blend-exclusion">
          slide
        </div>

        <div className="absolute -bottom-10 right-0 z-50 -skew-x-12 text-7xl font-bold uppercase tracking-tight mix-blend-exclusion">
          show
        </div>

        <div className="relative aspect-[4/3] w-200">
          <motion.ul
            ref={containerRef}
            drag="x"
            _dragX={dragX}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            dragControls={dragControls}
            dragListener={false}
            style={{
              transform: useMotionTemplate`translateX(${translateX}px)`,
            }}
            className="absolute inset-0 flex"
          >
            {slides.map((image, order) => (
              <Slide
                order={order}
                width={width}
                translateX={translateX}
                image={image}
              />
            ))}
          </motion.ul>

          <div className="absolute inset-0 flex items-center">
            <button
              onClick={handleShiftLeft}
              className="absolute left-0 z-50 flex h-14 w-14 items-center"
            >
              <ChevronLeftIcon className="h-full w-full" />
            </button>

            <button
              onClick={handleShiftRight}
              className="absolute right-0 z-50 flex h-14 w-14 items-center"
            >
              <ChevronRightIcon className="h-full w-full" />
            </button>
          </div>
        </div>
      </motion.main>
    </div>
  );
}

function Slide({ order, width, translateX, image }) {
  const breakpoints = [width * (order - 1), width * order, width * (order + 1)];

  const scale = useTransform(
    useTransform(translateX, Math.abs),
    breakpoints,
    [0.9, 1, 0.9],
  );

  const opacity = useTransform(
    useTransform(translateX, Math.abs),
    breakpoints,
    [0.5, 1, 0.5],
  );

  return (
    <motion.li
      style={{ scale, opacity }}
      className="pointer-events-none h-full w-full shrink-0 overflow-hidden rounded-xl"
    >
      <img className="h-full w-full object-cover" src={image} alt="slide" />
    </motion.li>
  );
}
