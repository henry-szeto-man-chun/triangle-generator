import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnglesInputGroup, SidesInputGroup } from './TriangleDataInput';
import Triangle from '../models/Triangle';

describe('inputs', () => {

    test('angles', () => {
        const angles = [10, 60, NaN];
        render(<AnglesInputGroup getter={angles} handler={() => {}} triangle={null}></AnglesInputGroup>);
        const input1 = screen.getByLabelText('\u{03b1}:') as HTMLInputElement;
        const input2 = screen.getByLabelText('\u{03b2}:') as HTMLInputElement;
        const input3 = screen.getByLabelText('\u{03b3}:') as HTMLInputElement;

        expect(input1.value).toEqual('10')
        expect(input2.value).toEqual('60')
        expect(input3.value).toEqual('')
    })

    test('sides', () => {
        const sides = [0.9, 1.249, NaN];
        render(<SidesInputGroup getter={sides} handler={() => {}} triangle={null}></SidesInputGroup>)
        const input1 = screen.getByLabelText('a:') as HTMLInputElement;
        const input2 = screen.getByLabelText('b:') as HTMLInputElement;
        const input3 = screen.getByLabelText('c:') as HTMLInputElement;

        expect(input1.value).toEqual('0.9')
        expect(input2.value).toEqual('1.25') // rounding to 2 decimal place
        expect(input3.value).toEqual('')
    })

})

describe('placeholders', () => {
    const angles = [NaN, NaN, 90];
    const lengths = [1.5, 2.6, NaN];
    const triangle = new Triangle([30, 60, 90], [1.5, 2.6, 3]);

    test('angles', () => {
        render(<AnglesInputGroup getter={angles} handler={() => {}} triangle={triangle}></AnglesInputGroup>);
        const input1 = screen.getByLabelText('\u{03b1}:') as HTMLInputElement;
        const input2 = screen.getByLabelText('\u{03b2}:') as HTMLInputElement;
        const input3 = screen.getByLabelText('\u{03b3}:') as HTMLInputElement;

        expect(input1.placeholder).toEqual('30');
        expect(input2.placeholder).toEqual('60');
        expect(input3.placeholder).toEqual('');
    })

    test('sides', () => {
        render(<SidesInputGroup getter={lengths} handler={() => {}} triangle={triangle}></SidesInputGroup>);
        const input1 = screen.getByLabelText('a:') as HTMLInputElement;
        const input2 = screen.getByLabelText('b:') as HTMLInputElement;
        const input3 = screen.getByLabelText('c:') as HTMLInputElement;

        expect(input1.placeholder).toEqual('');
        expect(input2.placeholder).toEqual('');
        expect(input3.placeholder).toEqual('3');
    })
})