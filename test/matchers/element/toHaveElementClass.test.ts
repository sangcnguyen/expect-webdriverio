import { $ } from '@wdio/globals'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { toHaveElementClass, toHaveElementClassContaining } from '../../../src/matchers/element/toHaveClass.js'
import { getExpectMessage, getExpected, getReceived } from '../../__fixtures__/utils.js'

vi.mock('@wdio/globals')

describe('toHaveElementClass', () => {
    let el: WebdriverIO.Element

    beforeEach(async () => {
        el = await $('sel')
        el.getAttribute = vi.fn().mockImplementation((attribute: string) => {
            if(attribute === 'class') {
                return 'some-class another-class yet-another-class'
            }
            return null
        })
    })

    test('success when class name is present', async () => {
        const beforeAssertion = vi.fn()
        const afterAssertion = vi.fn()
        const result = await toHaveElementClass.call({}, el, "some-class", { beforeAssertion, afterAssertion })
        expect(result.pass).toBe(true)
        expect(beforeAssertion).toBeCalledWith({
            matcherName: 'toHaveElementClass',
            expectedValue: 'some-class',
            options: { beforeAssertion, afterAssertion }
        })
        expect(afterAssertion).toBeCalledWith({
            matcherName: 'toHaveElementClass',
            expectedValue: 'some-class',
            options: { beforeAssertion, afterAssertion },
            result
        })
    })

    test('success when including surrounding spaces and asymmetric matcher', async () => {
        const result = await toHaveElementClass.call({}, el, expect.stringContaining('some-class '))
        expect(result.pass).toBe(true)
        const result2 = await toHaveElementClass.call({}, el, expect.stringContaining(' another-class '))
        expect(result2.pass).toBe(true)
    })

    test('success with RegExp when class name is present', async () => {
        const result = await toHaveElementClass.call({}, el, /sOmE-cLaSs/i)
        expect(result.pass).toBe(true)
    })

    test('success if array matches with class', async () => {
        const result = await toHaveElementClass.call({}, el, ["some-class", "yet-another-class"])
        expect(result.pass).toBe(true)
    })

    test('failure if array does not match with class', async () => {
        const result = await toHaveElementClass.call({}, el, ["someclass", "anotherclass"])
        expect(result.pass).toBe(false)
    })

    describe('options', () => {
        test('should fail when class is not a string', async () => {
            el.getAttribute = vi.fn().mockImplementation(() => {
                return null
            })
            const result = await toHaveElementClass.call({}, el, "some-class")
            expect(result.pass).toBe(false)
        })

        test('should pass when trimming the attribute', async () => {
            el.getAttribute = vi.fn().mockImplementation(() => {
                return "  some-class  "
            })
            const result = await toHaveElementClass.call({}, el, "some-class", {trim: true})
            expect(result.pass).toBe(true)
        })

        test('should pass when ignore the case', async () => {
            const result = await toHaveElementClass.call({}, el, "sOme-ClAsS", {ignoreCase: true})
            expect(result.pass).toBe(true)
        })

        test('should pass if containing', async () => {
            const result = await toHaveElementClass.call({}, el, "some", {containing: true})
            expect(result.pass).toBe(true)
        })

        test('should pass if array ignores the case', async () => {
            const result = await toHaveElementClass.call({}, el, ["sOme-ClAsS", "anOther-ClAsS"], {ignoreCase: true})
            expect(result.pass).toBe(true)
        })
    })

    describe('failure when class name is not present', () => {
        let result: any

        beforeEach(async () => {
            result = await toHaveElementClass.call({}, el, "test")
        })

        test('failure', () => {
            expect(result.pass).toBe(false)
        })

        describe('message shows correctly', () => {
            test('expect message', () => {
                expect(getExpectMessage(result.message())).toContain('to have class')
            })
            test('expected message', () => {
                expect(getExpected(result.message())).toContain('test')
            })
            test('received message', () => {
                expect(getReceived(result.message())).toContain('some-class another-class')
            })
        })
    })

    describe('failure with RegExp when class name is not present', () => {
        let result: any

        beforeEach(async () => {
            result = await toHaveElementClass.call({}, el, /WDIO/)
        })

        test('failure', () => {
            expect(result.pass).toBe(false)
        })

        describe('message shows correctly', () => {
            test('expect message', () => {
                expect(getExpectMessage(result.message())).toContain('to have class')
            })
            test('expected message', () => {
                expect(getExpected(result.message())).toContain('/WDIO/')
            })
            test('received message', () => {
                expect(getReceived(result.message())).toContain('some-class another-class')
            })
        })
    })
})

describe('toHaveElementClassContaining', () => {
    let el: WebdriverIO.Element

    beforeEach(async () => {
        el = await $('sel')
        el.getAttribute = vi.fn().mockImplementation((attribute: string) => {
            if(attribute === 'class') {
                return 'some-class another-class'
            }
            return null
        })
    })

    test('success when whole class name is present', async () => {
        const result = await toHaveElementClassContaining.call({}, el, "some-class");
        expect(result.pass).toBe(true)
    });

    test('success when part of class name is present', async () => {
        const result = await toHaveElementClassContaining.call({}, el, "other");
        expect(result.pass).toBe(true)
    });

    describe('failure when class name is not present', () => {
        let result: any

        beforeEach(async () => {
            result = await toHaveElementClassContaining.call({}, el, "test");
        })

        test('failure', () => {
            expect(result.pass).toBe(false)
        })

        describe('message shows correctly', () => {
            test('expect message', () => {
                expect(getExpectMessage(result.message())).toContain('to have attribute class')
            })
            test('expected message', () => {
                expect(getExpected(result.message())).toContain('test')
            })
            test('received message', () => {
                expect(getReceived(result.message())).toContain('some-class another-class')
            })
        })
    });
})
