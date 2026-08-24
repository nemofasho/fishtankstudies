import { useEffect, useRef } from "react";

function WhiteboardCanvas({
  tool = "pen",
  events = [],
  onDraw
}) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const currentStrokeRef = useRef([]);

  useEffect(() => {
    resizeCanvas();
  }, []);

  useEffect(() => {
    drawExistingEvents();
  }, [events]);

  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };
  }, []);

  function resizeCanvas() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect =
      canvas.getBoundingClientRect();

    if (
      rect.width === 0 ||
      rect.height === 0
    ) {
      return;
    }

    canvas.width = rect.width;
    canvas.height = rect.height;

    drawExistingEvents();
  }

  function drawExistingEvents() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    events.forEach((event) => {
      if (!event.data) {
        return;
      }

      try {
        const stroke =
          JSON.parse(event.data);

        drawStroke(
          context,
          stroke.points,
          stroke.tool
        );
      } catch (error) {
        console.error(
          "Failed to draw whiteboard event:",
          error
        );
      }
    });
  }

  function drawStroke(
    context,
    points,
    strokeTool
  ) {
    if (
      !points ||
      points.length === 0
    ) {
      return;
    }

    context.beginPath();

    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoin = "round";

    context.globalCompositeOperation =
      strokeTool === "eraser"
        ? "destination-out"
        : "source-over";

    context.moveTo(
      points[0].x,
      points[0].y
    );

    for (let i = 1; i < points.length; i++) {
      context.lineTo(
        points[i].x,
        points[i].y
      );
    }

    context.stroke();

    context.globalCompositeOperation =
      "source-over";
  }

  function getPosition(event) {
    const canvas = canvasRef.current;

    const rect =
      canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function startDrawing(event) {
    const position =
      getPosition(event);

    drawingRef.current = true;

    currentStrokeRef.current = [
      position
    ];

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.beginPath();
    context.moveTo(
      position.x,
      position.y
    );

    canvas.setPointerCapture(
      event.pointerId
    );
  }

  function draw(event) {
    if (!drawingRef.current) {
      return;
    }

    const position =
      getPosition(event);

    currentStrokeRef.current.push(
      position
    );

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoin = "round";

    context.globalCompositeOperation =
      tool === "eraser"
        ? "destination-out"
        : "source-over";

    context.lineTo(
      position.x,
      position.y
    );

    context.stroke();

    context.beginPath();
    context.moveTo(
      position.x,
      position.y
    );
  }

  async function stopDrawing(event) {
    if (!drawingRef.current) {
      return;
    }

    drawingRef.current = false;

    try {
      const canvas = canvasRef.current;

      canvas.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture may already be released.
    }

    const points =
      currentStrokeRef.current;

    currentStrokeRef.current = [];

    if (
      points.length < 2 ||
      !onDraw
    ) {
      return;
    }

    const data = JSON.stringify({
      tool,
      points
    });

    try {
      await onDraw({
        eventType: "DRAW",
        objectId: null,
        data
      });
    } catch (error) {
      console.error(
        "Failed to save stroke:",
        error
      );
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className="whiteboard-canvas"
      onPointerDown={startDrawing}
      onPointerMove={draw}
      onPointerUp={stopDrawing}
      onPointerCancel={stopDrawing}
      onPointerLeave={() => {
        if (drawingRef.current) {
          // Don't stop the stroke here.
          // Pointer capture keeps drawing active.
        }
      }}
    />
  );
}

export default WhiteboardCanvas;