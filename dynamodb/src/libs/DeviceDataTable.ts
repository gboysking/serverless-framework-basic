import { CreateTableInput} from "@aws-sdk/client-dynamodb";
import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

import { BaseDynamoDBTable, Options } from "./BaseDynamoDBTable";

interface DeviceData {
    device_id: string;
    type: string;
    timestamp: number;
    [key: string]: any;
}

export class DeviceDataTable extends BaseDynamoDBTable {
    constructor(options: Options) {
        super(options);
    }

    buildTableSchema(): CreateTableInput {
        return {
            AttributeDefinitions: [
                {
                    AttributeName: 'device_id_type',
                    AttributeType: 'S',
                },
                {
                    AttributeName: 'timestamp',
                    AttributeType: 'N',
                },
            ],
            KeySchema: [
                {
                    AttributeName: 'device_id_type',
                    KeyType: 'HASH',
                },
                {
                    AttributeName: 'timestamp',
                    KeyType: 'RANGE',
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
            TableName: this.table
        };
    }

    async putItem(device_id: string, type: string, timestamp: number, data: Omit<DeviceData, 'device_id' | 'type'>): Promise<void> {
        await this.onReady();
        const item: DeviceData = {
            device_id_type: device_id + '#' + type,
            device_id,
            type,
            timestamp,
            data,
        };

        const command = new PutCommand({
            TableName: this.table,
            Item: item,
        });

        await this.client.send(command);
    }

    async getItems(device_id: string, type: string, startTime: number, endTime: number): Promise<Array<DeviceData>> {
        await this.onReady();
        const command = new QueryCommand({
            TableName: this.table,
            KeyConditionExpression: '#device_id_type = :device_id_type AND #ts BETWEEN :start_time AND :end_time',
            ExpressionAttributeNames: {
                '#device_id_type': 'device_id_type',
                '#ts': 'timestamp',
            },
            ExpressionAttributeValues: {
                ':device_id_type': device_id + '#' + type,
                ':start_time': startTime,
                ':end_time': endTime,
            },
        });
    
        const result = await this.client.send(command);
        return result.Items as Array<DeviceData>;
    }
    async deleteItem(device_id: string, type: string, timestamp: number): Promise<void> {
        await this.onReady();
        const command = new DeleteCommand({
            TableName: this.table,
            Key: {
                device_id_type: device_id + '#' + type,
                timestamp: timestamp,
            },
        });

        await this.client.send(command);
    }
}
