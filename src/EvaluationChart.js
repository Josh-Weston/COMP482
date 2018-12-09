import React from 'react';
import ReactDOM from 'react-dom';

export default class EvaluationDialog extends React.Component {
    constructor(props) {
        super(props);
        this.domNode = React.createRef();
        this.removeChart = this.removeChart.bind(this);
        this.createChart = this.createChart.bind(this);
        this.updateSize = this.updateSize.bind(this);
        this.calculateSize = this.calculateSize.bind(this);
        let {chartHeight, chartWidth, width, height} = this.calculateSize();
        this.state = {
            open: false,
            width,
            height,
            chartHeight,
            chartWidth
        }
    }

    componentDidUpdate() {
        this.removeChart();
        this.createChart();
    }

    componentDidMount() {
        this.createChart();
        window.addEventListener('resize', this.updateSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSize);
    }

    calculateSize() {
        let clientWidth = window.innerHeight,
            clientHeight = window.innerWidth,
            widthBuffer = 250,
            heightBuffer = 100,
            baseline = 400;

        let sizeObj;

        if (clientHeight < 700) {
            sizeObj = {
                chartHeight: baseline,
                chartWidth: baseline,
                width: baseline + widthBuffer,
                height: baseline + heightBuffer
            };
        } else {
            let determinant = clientWidth < clientHeight ? clientWidth : clientHeight;
            sizeObj = {
                chartWidth: baseline + determinant - 700,
                chartHeight:  baseline + determinant - 700,
                width: baseline + determinant - 700 + widthBuffer,
                height: baseline + determinant - 700 + heightBuffer
            };
        }

        return sizeObj;
    }

    updateSize() {

        let {chartHeight, chartWidth, width, height} = this.calculateSize();
        this.setState({
            chartHeight,
            chartWidth,
            width,
            height
        });
    }

    // Manually control the DOM because d3 and React both want to
    removeChart() {
        while (this.domNode.current.firstChild) {
            ReactDOM.unmountComponentAtNode(this.domNode.current.firstChild);
            this.domNode.current.removeChild(this.domNode.current.firstChild);
        }
    }

    createChart() {

        let data = JSON.parse(JSON.stringify(this.props.data));
        // We add random noise to keep points from overlapping too much
        data = data.map(el => {
            el['Evaluation Fast'] += Math.random() < 0.5 ? 0.15 : -0.15;
            el['Evaluation Big'] += Math.random() < 0.5 ? 0.15 : -0.15;
            return el;
        });

        let margin = {top: 10, right: 0, bottom: 0, left: 50},
            chartHeight = this.state.chartHeight - margin.bottom - margin.top,
            chartWidth = this.state.chartWidth - margin.left - margin.right;

        let xScale = d3.scaleLinear().domain([0, 5]).range([0, chartWidth]).clamp(true),
            yScale = d3.scaleLinear().domain([0, 5]).range([chartHeight, 0]).clamp(true),
            svg = d3.select(this.domNode.current);

        let chartBody = svg.append('g')
            .attr('id', 'chart-body')
            .attr('transform', `translate(${margin.left + 75}, ${margin.top})`);

        chartBody.selectAll('circle')
           .data(data)
           .enter()
              .append('circle')
              .attr('r', 4)
              .attr('cx', d => xScale(d['Evaluation Fast']))
              .attr('cy', d => yScale(d['Evaluation Big']))
              .attr('fill', '#009688')
              .attr('stroke', '#707070');

        chartBody.selectAll('text')
            .data(data)
            .enter()
                .append('text')
                .attr('x', d => xScale(d['Evaluation Fast']) + 10)
                .attr('y', d => yScale(d['Evaluation Big']) + 4)
                .text(d => d['Project Name'])
                .attr('font-size', '10px')
                .append('tspan')
                    .text(d => `(${d['Status']})`)
                    .attr('x', d => xScale(d['Evaluation Fast']) + 10)
                    .attr('y', d => yScale(d['Evaluation Big']) + 15)
                    .attr('font-size', '8px')
                    
        let crossHairLine = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        // Vertical cross-hair
        let vertical = [{x: 2.5, y: 0}, {x: 2.5, y: 5}];
        chartBody.append('path')
            .datum(vertical)
            .attr('d', d => crossHairLine(d))
            .attr('stroke-width', 1)
            .attr('stroke', '#707070')
            .attr('stroke-dasharray', 2);

        let horizontal = [{y: 2.5, x: 0}, {y: 2.5, x: 5}];
        chartBody.append('path')
            .datum(horizontal)
            .attr('d', d => crossHairLine(d))
            .attr('stroke-width', 1)
            .attr('stroke', '#707070')
            .attr('stroke-dasharray', 2);
        
        // Y Axis
        chartBody.append('g')
            .append('line')
            .attr('y2', chartHeight)
            .attr('stroke-width', '4')
            .attr('stroke', '#707070');

        // X Axis
        chartBody.append('g')
            .append('line')
            .attr('x2', chartWidth)
            .attr('stroke-width', '4')
            .attr('stroke', '#707070')
            .attr("transform", `translate(0, ${chartHeight - 2})`)

        // Add arrows
        chartBody.append('path')
            .attr('d', 'M8 5v14l11-7z')
            .attr('fill', '#707070')
            .attr('transform', 'translate(-12, 10) rotate(-90)');

        chartBody.append('path')
            .attr('d', 'M8 5v14l11-7z')
            .attr('fill', '#707070')
            .attr('transform', `translate(${chartWidth - 9}, ${chartHeight - 15})`);

        // Inner Cell Verbiage
        let xVerbiage = [{text: 'SLOWER/LESS LIKELY', value: 1}, {text: 'FAST/MORE LIKELY', value: 3.5}];
        chartBody.append('g').selectAll('text')
            .data(xVerbiage)
            .enter()
                .append('text')
                .attr('x', d => xScale(d.value))
                .attr('y', chartHeight - 10)
                .text(d => d.text)
                .attr('font-size', '8px')
                .attr('fill', '#707070');

        let yVerbiage = [{text: 'SMALLER', value: 1.25}, {text: 'BIGGER', value: 3.75}];
        chartBody.append('g').selectAll('text')
            .data(yVerbiage)
            .enter()
                .append('text')
                .attr('x', d => yScale(d.value)) // Because of rotate
                .attr('y', -8)
                .text(d => d.text)
                .attr('font-size', '8px')
                .attr('fill', '#707070')
                .attr('transform', 'rotate(90)');
            
        xVerbiage = chartBody.append('g');
        xVerbiage.append('text')
            .text('FAST & DOABLE')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .attr('fill', '#707070')
            .attr('y', chartHeight + 30)
        
        let description = ['How quickly could this get to market and scale?', 'How addressable are the hurdles in front of us'];    
        xVerbiage.append('g').selectAll('text')
            .data(description)
            .enter()
                .append('text')
                .text(d => d)
                .attr('font-size', '12px')
                .attr('fill', '#707070')
                .attr('y', (d, i) => chartHeight + 50 + (i * 15))

        yVerbiage = chartBody.append('g');
        yVerbiage.append('text')
            .text('BIG')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .attr('fill', '#707070')
            .attr('x', -chartHeight + 5)
            .attr('y', -55)
            .attr('transform', 'rotate(-90)');

        description = ['If we pull this off, how big can it get?', 'Is there additional strategic value?'];    
        yVerbiage.append('g').selectAll('text')
            .data(description)
            .enter()
                .append('text')
                .text(d => d)
                .attr('font-size', '12px')
                .attr('fill', '#707070')
                .attr('x', -chartHeight + 5)
                .attr('y', (d, i) => -35 + (i * 15))
                .attr('transform', 'rotate(-90)');
    }
        
    render() {
        return <svg id="evaluation-chart" ref={this.domNode} height={this.state.height} width={this.state.width}></svg>
    }
}
