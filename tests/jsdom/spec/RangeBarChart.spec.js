import { scaleLinear, scalePoint } from 'd3-scale';
import { mount } from 'enzyme';
import React from 'react';
import { Bar, RangeBarChart } from '../../../src';

describe('RangeBarChart', () => {
  const props = {
    xScale: scalePoint()
      .domain(['a', 'b', 'c'])
      .range([0, 100]),
    yScale: scaleLinear()
      .domain([0, 1])
      .range([100, 0]),
    data: [['a', [0.3, 0.5]], ['b', [0.6, 0.9]]],
    x: d => d[0],
    y: d => d[1][0],
    yEnd: d => d[1][1],
    barThickness: 10,
    barClassName: 'my-bar',
    barStyle: { fill: 'blue' },
    onMouseEnterBar: jest.fn(),
    onMouseMoveBar: jest.fn(),
    onMouseLeaveBar: jest.fn(),
    onClick: jest.fn(),
  };

  it('passes props to Bar elements', () => {
    const chart = mount(<RangeBarChart {...props} />);
    const bars = chart.find('rect');

    bars.forEach(bar => {
      expect(bar.props().className).toContain(props.barClassName);
      expect(bar.props().style).toEqual(props.barStyle);
    });
  });

  it('renders a bar chart with categorical X data & numerical Y data', () => {
    // make simple bar chart with 3 datapoints to make sure it renders correctly
    // this is more of an integration test/sanity check;
    // most tests for render correctness are in RangeRect and Bar specs
    const chart = mount(<RangeBarChart {...props} />);
    const group = chart.find('g');
    const bars = chart.find('rect');
    expect(group).toHaveLength(1);
    expect(bars).toHaveLength(2);

    expect(bars.at(0).props().x).toEqual(0 - props.barThickness / 2);
    expect(bars.at(0).props().width).toEqual(props.barThickness);
    expect(bars.at(0).props().y).toEqual(50);
    expect(bars.at(0).props().height).toEqual(20);

    expect(bars.at(1).props().x).toEqual(50 - props.barThickness / 2);
    expect(bars.at(1).props().width).toEqual(props.barThickness);
    expect(Math.round(bars.at(1).props().y)).toEqual(10);
    expect(bars.at(1).props().height).toEqual(30);
  });

  it('triggers event handlers', () => {
    const chart = mount(<RangeBarChart {...props} />);
    const bars = chart.find(Bar);

    expect(props.onMouseMoveBar).not.toHaveBeenCalled();
    bars.at(1).simulate('mousemove');
    expect(props.onMouseMoveBar).toHaveBeenCalled();

    expect(props.onMouseEnterBar).not.toHaveBeenCalled();
    bars.at(1).simulate('mouseenter');
    expect(props.onMouseEnterBar).toHaveBeenCalled();

    expect(props.onMouseLeaveBar).not.toHaveBeenCalled();
    bars.at(1).simulate('mouseleave');
    expect(props.onMouseLeaveBar).toHaveBeenCalled();

    expect(props.onClick).not.toHaveBeenCalled();
    bars.at(1).simulate('click');
    expect(props.onClick).toHaveBeenCalled();
  });
});
