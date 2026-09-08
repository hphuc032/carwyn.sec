import { network, nodeColor, projectPoint } from "@/lib/network-topology";

export function StaticNetwork() {
  return <svg className="network-static" viewBox="0 0 500 500" aria-hidden="true" focusable="false">
    {network.edges.map(([a, b]) => {
      const p = network.nodes[a]!, q = network.nodes[b]!;
      const [x1, y1] = projectPoint(p), [x2, y2] = projectPoint(q);
      return <line key={`${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#88939b" strokeWidth=".8" opacity={.14 + (p[2] + q[2] + 2) * .105} />;
    })}
    {network.nodes.map((point, index) => {
      const [cx, cy] = projectPoint(point);
      return <circle key={index} cx={cx} cy={cy} r={index % 37 === 0 ? 2.7 : 1.55} fill={nodeColor(index)} opacity={.35 + (point[2] + 1) * .3} />;
    })}
  </svg>;
}
