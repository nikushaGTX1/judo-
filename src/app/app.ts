import { AfterViewInit, Component, ElementRef, HostListener, inject, signal } from '@angular/core';

interface Session {
  time: string;
  name: string;
  level: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly activeDay = signal('ორშ');
  protected readonly submitted = signal(false);
  protected readonly year = new Date().getFullYear();

  protected readonly stats = [
    { value: '15+', label: 'წელი ტატამზე' },
    { value: '400+', label: 'აქტიური წევრი' },
    { value: '120', label: 'ტურნირის მედალი' },
    { value: '8', label: 'სერტიფიცირებული მწვრთნელი' }
  ];

  protected readonly programs = [
    {
      kanji: '子',
      title: 'პატარა ვეფხვები',
      age: '4–7 წელი',
      text: 'თამაშზე აგებული ვარჯიშები, რომლებიც ავითარებს წონასწორობას, კოორდინაციას და უსაფრთხო დაცემას.'
    },
    {
      kanji: '若',
      title: 'ახალგაზრდული ძიუდო',
      age: '8–15 წელი',
      text: 'სროლები, დაჭერები და ნამდვილი რანდორი. ბავშვები იძენენ თავდაჯერებას, ყურადღებას და მეგობრებს.'
    },
    {
      kanji: '大',
      title: 'ზრდასრულთა ჯგუფი',
      age: '16+ წელი',
      text: 'დამწყებებიდან შავ ქამრებამდე. გახდი ფორმაში, ისწავლე თავდაცვა და ივარჯიშე მიზნით.'
    },
    {
      kanji: '勝',
      title: 'სანაკრებო გუნდი',
      age: 'შერჩევით',
      text: 'მაღალი ინტენსივობის ვარჯიში ეროვნული და საერთაშორისო ტურნირებისთვის.'
    }
  ];

  protected readonly days = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ'];

  private readonly schedule: Record<string, Session[]> = {
    ორშ: [
      { time: '16:00 – 17:00', name: 'პატარა ვეფხვები', level: '4–7 წელი' },
      { time: '17:15 – 18:30', name: 'ახალგაზრდული ძიუდო', level: '8–15 წელი' },
      { time: '19:00 – 20:30', name: 'ზრდასრულთა ჯგუფი', level: 'ყველა დონე' }
    ],
    სამ: [
      { time: '17:00 – 18:30', name: 'ახალგაზრდული ძიუდო', level: 'მოწინავე' },
      { time: '19:00 – 21:00', name: 'სანაკრებო გუნდი', level: 'შერჩეულები' }
    ],
    ოთხ: [
      { time: '16:00 – 17:00', name: 'პატარა ვეფხვები', level: '4–7 წელი' },
      { time: '17:15 – 18:30', name: 'ახალგაზრდული ძიუდო', level: '8–15 წელი' },
      { time: '19:00 – 20:30', name: 'ზრდასრულთა ჯგუფი', level: 'ყველა დონე' }
    ],
    ხუთ: [
      { time: '17:00 – 18:30', name: 'ახალგაზრდული ძიუდო', level: 'მოწინავე' },
      { time: '19:00 – 21:00', name: 'სანაკრებო გუნდი', level: 'შერჩეულები' }
    ],
    პარ: [
      { time: '17:00 – 18:00', name: 'კატა და ტექნიკა', level: 'ყველა ასაკი' },
      { time: '18:30 – 20:00', name: 'ღია რანდორი', level: 'მოზარდები და უფროსები' }
    ],
    შაბ: [
      { time: '10:00 – 11:00', name: 'პატარა ვეფხვები', level: '4–7 წელი' },
      { time: '11:15 – 12:45', name: 'საოჯახო ძიუდო', level: 'მშობლები და ბავშვები' }
    ]
  };

  protected readonly coaches = [
    { name: 'გიორგი ბერიძე', rank: 'მე-6 დანი', role: 'მთავარი მწვრთნელი', initials: 'გბ' },
    { name: 'ნინო კაპანაძე', rank: 'მე-4 დანი', role: 'ახალგაზრდული პროგრამა', initials: 'ნკ' },
    { name: 'ლევან წიკლაური', rank: 'მე-5 დანი', role: 'სანაკრებო გუნდი', initials: 'ლწ' }
  ];

  protected readonly testimonials = [
    {
      quote: 'ჩემი შვილი მორცხვი და მოუსვენარი იყო. ერთ წელიწადში დამშვიდდა, თავდაჯერებული გახდა და ყვითელი ქამრით ამაყობს.',
      author: 'თამარ მ.',
      role: 'მშობელი'
    },
    {
      quote: '34 წლის ასაკში დავიწყე, გამოცდილების გარეშე. საუკეთესო გადაწყვეტილება — კარგი ფორმა და შესანიშნავი გარემო.',
      author: 'დავით კ.',
      role: 'კლუბის წევრი'
    },
    {
      quote: 'მსოფლიო დონის მწვრთნელები. ადგილობრივი ტურნირებიდან ეროვნულ კვარცხლბეკამდე მიმიყვანეს.',
      author: 'ანა ს.',
      role: 'სანაკრებო გუნდი'
    }
  ];

  protected sessions(): Session[] {
    return this.schedule[this.activeDay()];
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 40);
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    this.host.nativeElement.querySelectorAll('.reveal').forEach((el: Element) => observer.observe(el));
  }
}
