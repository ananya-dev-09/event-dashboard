export default async function OrganizationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <main className="mx-auto w-full max-w-6xl p-6"><section className="panel">Organization: {slug}</section></main>;
}
