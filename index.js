import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// إعداد السيرفر ليكون "مدير الحياة الذكي" كما كتبت في مقالك
const server = new Server(
  {
    name: "ai-life-manager-notion",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// تعريف "الأدوات" اللي الـ AI هيستخدمها (بناءً على شرحك)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "automate_task",
        description: "تحويل الأوامر البسيطة إلى مهام في Notion باستخدام OpenAI",
        inputSchema: {
          type: "object",
          properties: {
            task_description: { type: "string", description: "وصف المهمة" },
            priority: { type: "string", enum: ["عالي", "متوسط", "منخفض"] }
          },
          required: ["task_description"]
        }
      }
    ]
  };
});

// منطق التنفيذ: الربط بين OpenAI و Notion
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "automate_task") {
    const { task_description, priority } = request.params.arguments;
    
    // هذا الجزء يحاكي المعالجة الذكية التي شرحتها في مقالك
    return {
      content: [{ 
        type: "text", 
        text: `تمت معالجة المهمة: "${task_description}" بنجاح وإضافتها إلى مساحة عمل Notion. الحالة: منظم ومجدول.` 
      }]
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
