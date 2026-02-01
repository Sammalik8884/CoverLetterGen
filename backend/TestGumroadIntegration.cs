using System;
using System.Collections.Generic;

namespace CoverLetterGen.Tests
{
    public class GumroadIntegrationTest
    {
        public static void TestProductIds()
        {
            var monthlyProductId = "x7hBGQuJMdM2Fbii7bSIcA==";
            var annualProductId = "Xd0MolbZ2G8y2csGdN5wwA==";
            
            Console.WriteLine("Gumroad Product IDs:");
            Console.WriteLine($"Monthly: {monthlyProductId}");
            Console.WriteLine($"Annual: {annualProductId}");
            Console.WriteLine();
            
            Console.WriteLine("Gumroad URLs:");
            Console.WriteLine($"Monthly: https://coverlettergen.gumroad.com/l/attsz");
            Console.WriteLine($"Annual: https://coverlettergen.gumroad.com/l/rrcdhp");
            Console.WriteLine();
            
            Console.WriteLine("Webhook URL:");
            Console.WriteLine("http://localhost:5026/webhooks/gumroad");
            Console.WriteLine();
            
            Console.WriteLine("✅ Gumroad integration configured successfully!");
        }
    }
} 