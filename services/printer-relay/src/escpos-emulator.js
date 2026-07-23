class ESCPOSEmulator {
    constructor() {
        this.commands = {
            initialize: Buffer.from([0x1B, 0x40]),
            cut: Buffer.from([0x1D, 0x56, 0x00]),
            feed: (lines) => Buffer.from([0x1B, 0x64, lines]),
            bold: (text) => Buffer.concat([Buffer.from([0x1B, 0x45, 0x01]), Buffer.from(text), Buffer.from([0x1B, 0x45, 0x00])]),
            underline: (text) => Buffer.concat([Buffer.from([0x1B, 0x2D, 0x01]), Buffer.from(text), Buffer.from([0x1B, 0x2D, 0x00])]),
            center: () => Buffer.from([0x1B, 0x61, 0x01]),
            left: () => Buffer.from([0x1B, 0x61, 0x00]),
            fontSize: (size) => Buffer.from([0x1B, 0x21, size]),
        };
    }

    parseCommand(data) {
        if (data.length === 0) {
            return { type: 'empty', length: 0 };
        }

        const firstByte = data[0];

        if (firstByte === 0x1B) {
            if (data[1] === 0x40) {
                return { type: 'initialize', length: data.length };
            } else if (data[1] === 0x64) {
                return { type: 'feed', length: data.length, lines: data[2] || 0 };
            } else if (data[1] === 0x61) {
                return { type: 'align', length: data.length, alignment: data[2] };
            } else if (data[1] === 0x2D) {
                return { type: 'underline', length: data.length };
            } else if (data[1] === 0x45) {
                return { type: 'bold', length: data.length };
            } else if (data[1] === 0x21) {
                return { type: 'fontSize', length: data.length, size: data[2] };
            }
            return { type: 'esc_command', length: data.length };
        }

        if (firstByte === 0x1D) {
            if (data[1] === 0x56) {
                return { type: 'cut', length: data.length };
            }
            return { type: 'gs_command', length: data.length };
        }

        return { type: 'text', length: data.length };
    }

    buildReceiptHeader(title) {
        return Buffer.concat([
            this.commands.center(),
            this.commands.fontSize(0x10),
            this.commands.bold(`* ${title} *`),
            this.commands.fontSize(0x00),
            this.commands.left(),
            Buffer.from('\n')
        ]);
    }

    buildReceiptFooter(total, tax, discount) {
        const lines = [
            `Subtotal: $${(total - tax + discount).toFixed(2)}`,
            `Tax (7%): $${tax.toFixed(2)}`,
            `Discount: -$${discount.toFixed(2)}`,
            `Total: $${total.toFixed(2)}`,
            '',
            'Thank you for your purchase!',
            'Please keep this receipt'
        ];

        return Buffer.concat(lines.map(line =>
            Buffer.concat([
                this.commands.center(),
                Buffer.from(line),
                Buffer.from('\n')
            ])
        ));
    }

    buildItemLine(description, quantity, unitPrice) {
        const total = (quantity * unitPrice).toFixed(2);
        const line = `${description} x${quantity} = $${total}`;
        return Buffer.concat([
            this.commands.left(),
            Buffer.from(line),
            Buffer.from('\n')
        ]);
    }
}

module.exports = { ESCPOSEmulator };